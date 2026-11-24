const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { pool: defaultPool, init } = require("./db");
const {
  normalizeEmail,
  isValidEmail,
  isValidCareer,
  hashPassword,
  verifyPassword,
  resolveAuthSecret,
  signToken,
  verifyToken,
} = require("./auth");

const SUBJECTS = ["MET", "NAV", "RPA", "CT", "TSV"];
const SUBJECT_NAMES = Object.freeze({
  MET: "Meteorologia Aeronáutica",
  NAV: "Navegação Aérea",
  RPA: "Regulamentos de Tráfego Aéreo",
  CT: "Conhecimentos Técnicos e Motores",
  TSV: "Teoria de Voo",
});
const PASSING_THRESHOLD = 70;
const VALID_EXAM_TYPES = ["nivelamento", "personalizado"];

// Nunca envia o gabarito ao público
const publica = (r) => ({
  id: r.codigo,
  subject: r.materia_sigla,
  topic: r.subtopico,
  difficulty: r.dificuldade,
  stem: r.enunciado,
  options: r.alternativas,
});

// Nunca expõe senha_hash ao cliente
const sanitizeUser = (row) => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  carreira: row.carreira,
  nivelamento_concluido: Boolean(row.nivelamento_concluido),
});

const validarQuestao = (b) =>
  b &&
  SUBJECTS.includes(b.subject) &&
  typeof b.topic === "string" &&
  b.topic.length <= 120 &&
  typeof b.stem === "string" &&
  b.stem.length <= 2000 &&
  Array.isArray(b.options) &&
  b.options.length === 4 &&
  b.options.every((o) => typeof o === "string" && o.length <= 500) &&
  Number.isInteger(b.correct) &&
  b.correct >= 0 &&
  b.correct <= 3;

function parseSubjectsQuery(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return [...SUBJECTS];
  }
  const selected = [
    ...new Set(
      String(raw)
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter((s) => SUBJECTS.includes(s))
    ),
  ];
  return selected.length > 0 ? selected : null;
}

function parseQuantityQuery(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return 10;
  }
  const parsed = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(50, Math.max(5, parsed));
}

function isValidOptionIndex(value) {
  return Number.isInteger(value) && value >= 0 && value <= 3;
}

function scoreExam(rows, respostas) {
  const porMateria = {};
  let totalAcertos = 0;

  for (const r of rows) {
    const m = (porMateria[r.materia_sigla] ||= { total: 0, acertos: 0, erradas: [] });
    m.total++;

    const ans = Object.prototype.hasOwnProperty.call(respostas, r.codigo) ? respostas[r.codigo] : undefined;
    if (isValidOptionIndex(ans) && ans === r.indice_correta) {
      m.acertos++;
      totalAcertos++;
    } else {
      m.erradas.push({ id: r.codigo, topic: r.subtopico, explanation: r.comentario || "" });
    }
  }

  const detalhesDb = {};
  for (const [sigla, m] of Object.entries(porMateria)) {
    m.percentual = Math.round((m.acertos / m.total) * 100);
    detalhesDb[sigla] = {
      total: m.total,
      acertos: m.acertos,
      percentual: m.percentual,
      erradas: m.erradas.map(({ id, topic }) => ({ id, topic })),
    };
  }

  const totalQuestoes = rows.length;
  const percentual = Math.round((totalAcertos / totalQuestoes) * 100);
  return { totalQuestoes, totalAcertos, percentual, porMateria, detalhesDb };
}

function parseDetails(raw) {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw && typeof raw === "object" ? raw : null;
}

function buildMetricsReport(rows) {
  const porMateria = {};
  for (const sigla of SUBJECTS) {
    porMateria[sigla] = {
      sigla,
      nome: SUBJECT_NAMES[sigla],
      tentativas: 0,
      totalQuestoes: 0,
      totalAcertos: 0,
      ultimoPercentual: null,
      mediaAcumulada: null,
      aprovada: false,
      erradasRecentes: [],
    };
  }

  let totalQuestoes = 0;
  let totalAcertos = 0;

  // rows estão ordenadas da mais recente para a mais antiga (criado_em DESC, id DESC)
  for (const row of rows) {
    totalQuestoes += Number(row.total_questoes) || 0;
    totalAcertos += Number(row.total_acertos) || 0;

    const detalhes = parseDetails(row.detalhes_materias);
    if (!detalhes) continue;

    for (const sigla of SUBJECTS) {
      const entry = detalhes[sigla];
      if (!entry || typeof entry !== "object") continue;
      const entryTotal = Number(entry.total) || 0;
      const entryAcertos = Number(entry.acertos) || 0;
      if (entryTotal <= 0) continue;

      const m = porMateria[sigla];
      m.tentativas += 1;
      m.totalQuestoes += entryTotal;
      m.totalAcertos += entryAcertos;

      if (m.ultimoPercentual === null) {
        m.ultimoPercentual =
          typeof entry.percentual === "number"
            ? entry.percentual
            : Math.round((entryAcertos / entryTotal) * 100);
      }

      if (Array.isArray(entry.erradas)) {
        for (const errItem of entry.erradas) {
          if (
            errItem &&
            typeof errItem === "object" &&
            m.erradasRecentes.length < 6 &&
            !m.erradasRecentes.some((e) => e.id === errItem.id && e.topic === errItem.topic)
          ) {
            m.erradasRecentes.push({
              id: String(errItem.id || ""),
              topic: String(errItem.topic || ""),
            });
          }
        }
      }
    }
  }

  let materiasAprovadas = 0;
  let materiaCritica = null;
  const pontosFracos = [];

  for (const sigla of SUBJECTS) {
    const m = porMateria[sigla];
    if (m.totalQuestoes <= 0) continue;

    m.mediaAcumulada = Math.round((m.totalAcertos / m.totalQuestoes) * 100);
    m.aprovada = m.ultimoPercentual !== null && m.ultimoPercentual >= PASSING_THRESHOLD;

    if (m.aprovada) {
      materiasAprovadas += 1;
    } else {
      pontosFracos.push({
        sigla,
        nome: m.nome,
        ultimoPercentual: m.ultimoPercentual,
        mediaAcumulada: m.mediaAcumulada,
        subtopicosErrados: [...new Set(m.erradasRecentes.map((e) => e.topic).filter(Boolean))],
        erradasRecentes: m.erradasRecentes,
      });
    }

    if (
      materiaCritica === null ||
      m.ultimoPercentual < materiaCritica.ultimoPercentual ||
      (m.ultimoPercentual === materiaCritica.ultimoPercentual &&
        (m.mediaAcumulada ?? 0) < (materiaCritica.mediaAcumulada ?? 0))
    ) {
      materiaCritica = {
        sigla,
        nome: m.nome,
        ultimoPercentual: m.ultimoPercentual,
        mediaAcumulada: m.mediaAcumulada,
      };
    }
  }

  pontosFracos.sort(
    (a, b) =>
      a.ultimoPercentual - b.ultimoPercentual || (a.mediaAcumulada ?? 0) - (b.mediaAcumulada ?? 0)
  );

  const aproveitamentoGeral = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
  const historico = rows.slice(0, 10).map((r) => ({
    id: r.id,
    tipo: r.tipo,
    carreira: r.carreira,
    acertos: r.total_acertos,
    total: r.total_questoes,
    percentual: r.percentual,
    data: r.criado_em,
  }));

  return {
    resumo: {
      totalSimulados: rows.length,
      totalQuestoes,
      totalAcertos,
      aproveitamentoGeral,
      materiasAprovadas,
      totalMaterias: SUBJECTS.length,
      materiaCritica,
    },
    porMateria,
    pontosFracos,
    historico,
  };
}

/**
 * Builds and configures the Express application with injectable database pool and secrets.
 * @param {{ pool?: import("pg").Pool, authSecret?: string, adminToken?: string, frontendUrl?: string, setDbStatus?: string | ((s: string) => void), getDbStatus?: () => string }} [options]
 */
function createApp(options = {}) {
  const db = options.pool || defaultPool;
  const adminToken = options.adminToken !== undefined ? options.adminToken : process.env.ADMIN_TOKEN;
  const frontendUrl = options.frontendUrl !== undefined ? options.frontendUrl : process.env.FRONTEND_URL;

  const resolvedSecret = resolveAuthSecret({
    authSecret: options.authSecret !== undefined ? options.authSecret : process.env.AUTH_SECRET,
    adminToken,
    databaseUrl: process.env.DATABASE_URL,
  });
  const authSecret = resolvedSecret.secret;

  let dbStatus = typeof options.setDbStatus === "string" ? options.setDbStatus : "starting";
  const getDbStatus = () =>
    typeof options.getDbStatus === "function" ? options.getDbStatus() : dbStatus;

  const app = express();
  app.locals.usingFallbackAuthSecret = resolvedSecret.isFallback;
  app.setDbStatus = (status) => {
    dbStatus = status;
    if (typeof options.setDbStatus === "function") {
      options.setDbStatus(status);
    }
  };

  app.set("trust proxy", 1); // atrás do proxy do Railway (necessário p/ rate limit por IP)
  app.use(helmet());
  app.use(express.json({ limit: "20kb" }));

  // CORS: só os domínios permitidos podem chamar a API pelo navegador.
  const allowed = (frontendUrl || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60_000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { erro: "Muitas tentativas de autenticação. Aguarde alguns minutos." },
  });

  // Proteção das rotas de escrita (admin)
  function requireAdmin(req, res, next) {
    const token = (req.headers.authorization || "").replace(/^Bearer /, "");
    const a = Buffer.from(token);
    const b = Buffer.from(adminToken || "");
    if (!adminToken || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).json({ erro: "Não autorizado" });
    }
    next();
  }

  // Proteção das rotas autenticadas do aluno
  async function requireAuth(req, res, next) {
    try {
      const header = req.headers.authorization;
      if (typeof header !== "string" || !header.startsWith("Bearer ")) {
        return res.status(401).json({ erro: "Não autorizado" });
      }
      const token = header.slice(7).trim();
      if (!token) {
        return res.status(401).json({ erro: "Não autorizado" });
      }
      const payload = verifyToken(token, authSecret);
      if (!payload || !Number.isInteger(payload.uid) || payload.uid <= 0) {
        return res.status(401).json({ erro: "Token inválido ou expirado" });
      }
      const { rows } = await db.query(
        "SELECT id, nome, email, carreira, nivelamento_concluido FROM usuarios WHERE id = $1",
        [payload.uid]
      );
      if (rows.length === 0) {
        return res.status(401).json({ erro: "Usuário não encontrado" });
      }
      req.user = sanitizeUser(rows[0]);
      next();
    } catch (e) {
      next(e);
    }
  }

  // ---- Rotas Públicas & Saúde ----
  app.get("/", (_req, res) =>
    res.json({
      status: "AeroBanca ANAC API Online",
      db: getDbStatus(),
      rotas: [
        "/health",
        "/questoes",
        "/simulado",
        "/simulado/personalizado",
        "/simulado/corrigir",
        "/auth/register",
        "/auth/login",
        "/auth/me",
        "/auth/career",
        "/metricas",
      ],
    })
  );
  app.get("/health", (_req, res) => res.json({ ok: true, db: getDbStatus() }));

  // ---- Autenticação de Alunos ----
  app.post("/auth/register", authLimiter, async (req, res, next) => {
    try {
      const { nome, email, senha, carreira } = req.body || {};
      const nomeTrim = typeof nome === "string" ? nome.trim() : "";
      const emailNorm = normalizeEmail(email);

      if (!nomeTrim || nomeTrim.length > 120) {
        return res.status(400).json({ erro: "Nome obrigatório (máx. 120 caracteres)." });
      }
      if (!isValidEmail(emailNorm)) {
        return res.status(400).json({ erro: "E-mail inválido." });
      }
      if (typeof senha !== "string" || senha.length < 6 || senha.length > 128) {
        return res.status(400).json({ erro: "Senha deve ter entre 6 e 128 caracteres." });
      }
      if (!isValidCareer(carreira)) {
        return res.status(400).json({ erro: "Carreira inválida. Selecione PP, PC ou CMS." });
      }

      const existing = await db.query("SELECT id FROM usuarios WHERE email = $1", [emailNorm]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ erro: "E-mail já cadastrado." });
      }

      const senhaHash = hashPassword(senha);
      const { rows } = await db.query(
        `INSERT INTO usuarios (nome, email, senha_hash, carreira)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nome, email, carreira, nivelamento_concluido`,
        [nomeTrim, emailNorm, senhaHash, carreira]
      );
      const user = sanitizeUser(rows[0]);
      const token = signToken({ uid: user.id, email: user.email }, authSecret);
      return res.status(201).json({ token, user });
    } catch (e) {
      if (e && e.code === "23505") {
        return res.status(409).json({ erro: "E-mail já cadastrado." });
      }
      next(e);
    }
  });

  app.post("/auth/login", authLimiter, async (req, res, next) => {
    try {
      const { email, senha, carreira } = req.body || {};
      const emailNorm = normalizeEmail(email);

      if (!isValidEmail(emailNorm)) {
        return res.status(400).json({ erro: "E-mail inválido." });
      }
      if (typeof senha !== "string" || senha.length === 0 || senha.length > 128) {
        return res.status(400).json({ erro: "Senha obrigatória." });
      }
      if (!isValidCareer(carreira)) {
        return res.status(400).json({ erro: "Carreira obrigatória. Selecione PP, PC ou CMS." });
      }

      const { rows } = await db.query(
        "SELECT id, nome, email, senha_hash, carreira, nivelamento_concluido FROM usuarios WHERE email = $1",
        [emailNorm]
      );
      if (rows.length === 0 || !verifyPassword(senha, rows[0].senha_hash)) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
      }

      let current = rows[0];
      if (current.carreira !== carreira) {
        const updated = await db.query(
          "UPDATE usuarios SET carreira = $1 WHERE id = $2 RETURNING id, nome, email, carreira, nivelamento_concluido",
          [carreira, current.id]
        );
        current = updated.rows[0];
      }

      const user = sanitizeUser(current);
      const token = signToken({ uid: user.id, email: user.email }, authSecret);
      return res.json({ token, user });
    } catch (e) {
      next(e);
    }
  });

  app.get("/auth/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  app.patch("/auth/career", requireAuth, async (req, res, next) => {
    try {
      const { carreira } = req.body || {};
      if (!isValidCareer(carreira)) {
        return res.status(400).json({ erro: "Carreira inválida. Selecione PP, PC ou CMS." });
      }
      const { rows } = await db.query(
        "UPDATE usuarios SET carreira = $1 WHERE id = $2 RETURNING id, nome, email, carreira, nivelamento_concluido",
        [carreira, req.user.id]
      );
      if (rows.length === 0) {
        return res.status(401).json({ erro: "Usuário não encontrado." });
      }
      return res.json({ user: sanitizeUser(rows[0]) });
    } catch (e) {
      next(e);
    }
  });

  // ---- Questões & Simulados ----
  app.get("/questoes", async (req, res, next) => {
    try {
      const materia = String(req.query.materia || "").toUpperCase();
      const { rows } = SUBJECTS.includes(materia)
        ? await db.query("SELECT * FROM questoes WHERE materia_sigla=$1 ORDER BY codigo", [materia])
        : await db.query("SELECT * FROM questoes ORDER BY materia_sigla, codigo");
      res.json(rows.map(publica));
    } catch (e) {
      next(e);
    }
  });

  // Simulado de nivelamento: 6 questões aleatórias de cada matéria = 30
  app.get("/simulado", async (_req, res, next) => {
    try {
      const { rows } = await db.query(`
        SELECT * FROM (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY materia_sigla ORDER BY RANDOM()) AS rn FROM questoes
        ) s WHERE rn <= 6 ORDER BY materia_sigla, rn`);
      res.json(rows.map(publica));
    } catch (e) {
      next(e);
    }
  });

  app.get("/simulado/personalizado", requireAuth, async (req, res, next) => {
    try {
      const materias = parseSubjectsQuery(req.query.materias);
      if (!materias) {
        return res.status(400).json({ erro: "Nenhuma matéria válida selecionada." });
      }
      const quantidade = parseQuantityQuery(req.query.quantidade);
      const { rows } = await db.query(
        "SELECT * FROM questoes WHERE materia_sigla = ANY($1) ORDER BY RANDOM() LIMIT $2",
        [materias, quantidade]
      );
      return res.json(rows.map(publica));
    } catch (e) {
      next(e);
    }
  });

  app.post("/questoes/:codigo/responder", requireAuth, async (req, res, next) => {
    try {
      const codigo = typeof req.params.codigo === "string" ? req.params.codigo.trim() : "";
      const alternativa = req.body ? req.body.alternativa : undefined;
      if (!codigo || !isValidOptionIndex(alternativa)) {
        return res.status(400).json({ erro: "Alternativa inválida." });
      }
      const { rows } = await db.query(
        "SELECT codigo, indice_correta, comentario FROM questoes WHERE codigo = $1",
        [codigo]
      );
      if (rows.length === 0) {
        return res.status(404).json({ erro: "Questão não encontrada." });
      }
      const q = rows[0];
      return res.json({
        correta: alternativa === q.indice_correta,
        indice_correta: q.indice_correta,
        comentario: q.comentario || "",
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/simulado/corrigir", requireAuth, async (req, res, next) => {
    try {
      const { respostas, questoes, tipo } = req.body || {};
      if (!VALID_EXAM_TYPES.includes(tipo)) {
        return res.status(400).json({ erro: "Tipo de simulado inválido." });
      }
      if (!respostas || typeof respostas !== "object" || Array.isArray(respostas)) {
        return res.status(400).json({ erro: "Respostas inválidas." });
      }
      if (!Array.isArray(questoes)) {
        return res.status(400).json({ erro: "Lista de questões inválida." });
      }

      const codigos = [
        ...new Set(questoes.filter((c) => typeof c === "string").map((c) => c.trim()).filter(Boolean)),
      ];
      if (codigos.length === 0 || codigos.length > 50) {
        return res.status(400).json({ erro: "Lista de questões deve conter entre 1 e 50 códigos." });
      }

      if (tipo === "nivelamento") {
        if (codigos.length !== 30) {
          return res.status(400).json({ erro: "O simulado de nivelamento exige exatamente 30 questões." });
        }
        const allAnswered = codigos.every((codigo) => {
          const ans = Object.prototype.hasOwnProperty.call(respostas, codigo) ? respostas[codigo] : undefined;
          return isValidOptionIndex(ans);
        });
        if (!allAnswered) {
          return res.status(400).json({ erro: "Todas as 30 questões do nivelamento devem ser respondidas." });
        }
      }

      const { rows } = await db.query("SELECT * FROM questoes WHERE codigo = ANY($1)", [codigos]);
      if (rows.length === 0) {
        return res.status(400).json({ erro: "Nenhuma questão válida encontrada." });
      }
      if (tipo === "nivelamento" && rows.length !== 30) {
        return res.status(400).json({ erro: "O simulado de nivelamento exige 30 questões válidas." });
      }

      const { totalQuestoes, totalAcertos, percentual, porMateria, detalhesDb } = scoreExam(rows, respostas);

      const inserted = await db.query(
        `INSERT INTO tentativas_simulado (usuario_id, tipo, carreira, total_questoes, total_acertos, percentual, detalhes_materias)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, criado_em`,
        [
          req.user.id,
          tipo,
          req.user.carreira,
          totalQuestoes,
          totalAcertos,
          percentual,
          JSON.stringify(detalhesDb),
        ]
      );

      let nivelamentoConcluido = req.user.nivelamento_concluido;
      if (tipo === "nivelamento") {
        await db.query("UPDATE usuarios SET nivelamento_concluido = TRUE WHERE id = $1", [req.user.id]);
        nivelamentoConcluido = true;
      }

      return res.json({
        tentativaId: inserted.rows[0].id,
        tipo,
        carreira: req.user.carreira,
        total_questoes: totalQuestoes,
        total_acertos: totalAcertos,
        percentual,
        nivelamento_concluido: nivelamentoConcluido,
        porMateria,
      });
    } catch (e) {
      next(e);
    }
  });

  app.get("/metricas", requireAuth, async (req, res, next) => {
    try {
      const { rows } = await db.query(
        `SELECT id, tipo, carreira, total_questoes, total_acertos, percentual, detalhes_materias, criado_em
         FROM tentativas_simulado
         WHERE usuario_id = $1
         ORDER BY criado_em DESC, id DESC`,
        [req.user.id]
      );
      return res.json(buildMetricsReport(rows));
    } catch (e) {
      next(e);
    }
  });

  // ---- Admin ----
  app.get("/admin/check", requireAdmin, (_req, res) => res.json({ ok: true }));

  app.get("/admin/questoes", requireAdmin, async (_req, res, next) => {
    try {
      const { rows } = await db.query("SELECT * FROM questoes ORDER BY criado_em DESC, codigo");
      res.json(rows.map((r) => ({ ...publica(r), correct: r.indice_correta, explanation: r.comentario })));
    } catch (e) {
      next(e);
    }
  });

  app.post("/questoes", requireAdmin, async (req, res, next) => {
    try {
      const b = req.body;
      if (!validarQuestao(b)) return res.status(400).json({ erro: "dados inválidos" });
      const { rows } = await db.query("SELECT COUNT(*)::int AS n FROM questoes WHERE materia_sigla=$1", [b.subject]);
      const codigo = `${b.subject}-${String(rows[0].n + 1).padStart(2, "0")}-${Date.now().toString(36)}`;
      await db.query(
        `INSERT INTO questoes (codigo, materia_sigla, subtopico, dificuldade, enunciado, alternativas, indice_correta, comentario)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          codigo,
          b.subject,
          b.topic,
          String(b.difficulty || "Banca ANAC").slice(0, 30),
          b.stem,
          JSON.stringify(b.options),
          b.correct,
          String(b.explanation || "").slice(0, 2000),
        ]
      );
      res.status(201).json({ id: codigo });
    } catch (e) {
      next(e);
    }
  });

  app.delete("/questoes/:codigo", requireAdmin, async (req, res, next) => {
    try {
      const r = await db.query("DELETE FROM questoes WHERE codigo=$1", [req.params.codigo]);
      res.json({ removidas: r.rowCount });
    } catch (e) {
      next(e);
    }
  });

  app.use((_req, res) => res.status(404).json({ erro: "Rota não encontrada" }));
  // Não vaza detalhes de erro ao cliente
  app.use((err, _req, res, _next) => {
    if (err && err.type === "entity.parse.failed") {
      return res.status(400).json({ erro: "JSON inválido" });
    }
    console.error(err);
    return res.status(500).json({ erro: "Erro interno" });
  });

  return app;
}

const app = createApp();

if (require.main === module) {
  const PORT = process.env.PORT || 3000; // O Railway define PORT sozinho
  if (app.locals.usingFallbackAuthSecret) {
    console.warn(
      "Aviso: AUTH_SECRET não definido; usando segredo fallback derivado. Configure AUTH_SECRET em produção."
    );
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API escutando em 0.0.0.0:${PORT}`);
    init()
      .then(() => {
        app.setDbStatus("connected");
        console.log("Banco PostgreSQL inicializado com sucesso");
      })
      .catch((e) => {
        app.setDbStatus(`error: ${e.message}`);
        console.error("Aviso ao conectar no banco:", e.message);
      });
  });
}

module.exports = { createApp, app };
