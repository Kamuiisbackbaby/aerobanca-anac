const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { pool, init } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000; // O Railway define PORT sozinho
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const SUBJECTS = ["MET", "NAV", "RPA", "CT", "TSV"];

app.set("trust proxy", 1); // atrás do proxy do Railway (necessário p/ rate limit por IP)
app.use(helmet());
app.use(express.json({ limit: "20kb" }));

// CORS: só o site do Vercel pode chamar a API pelo navegador.
const allowed = (process.env.FRONTEND_URL || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

// Proteção das rotas de escrita (admin)
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  const a = Buffer.from(token);
  const b = Buffer.from(ADMIN_TOKEN || "");
  if (!ADMIN_TOKEN || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ erro: "Não autorizado" });
  }
  next();
}

// Nunca envia o gabarito ao público
const publica = (r) => ({
  id: r.codigo,
  subject: r.materia_sigla,
  topic: r.subtopico,
  difficulty: r.dificuldade,
  stem: r.enunciado,
  options: r.alternativas,
});

let dbStatus = "starting";

app.get("/", (_req, res) => res.json({ status: "AeroBanca ANAC API Online", db: dbStatus, rotas: ["/health", "/questoes", "/simulado"] }));
app.get("/health", (_req, res) => res.json({ ok: true, db: dbStatus }));

// Lista completa para o admin (inclui gabarito)
app.get("/admin/questoes", requireAdmin, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM questoes ORDER BY criado_em DESC, codigo");
    res.json(rows.map((r) => ({ ...publica(r), correct: r.indice_correta, explanation: r.comentario })));
  } catch (e) { next(e); }
});

// Lista questões (opcionalmente por matéria) sem gabarito
app.get("/questoes", async (req, res, next) => {
  try {
    const materia = String(req.query.materia || "").toUpperCase();
    const { rows } = SUBJECTS.includes(materia)
      ? await pool.query("SELECT * FROM questoes WHERE materia_sigla=$1 ORDER BY codigo", [materia])
      : await pool.query("SELECT * FROM questoes ORDER BY materia_sigla, codigo");
    res.json(rows.map(publica));
  } catch (e) { next(e); }
});

// Simulado de nivelamento: 6 questões aleatórias de cada matéria = 30
app.get("/simulado", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY materia_sigla ORDER BY RANDOM()) AS rn FROM questoes
      ) s WHERE rn <= 6 ORDER BY materia_sigla, rn`);
    res.json(rows.map(publica));
  } catch (e) { next(e); }
});

// Correção feita no servidor: body { respostas: { "MET-01": 1, ... } }
app.post("/simulado/corrigir", async (req, res, next) => {
  try {
    const respostas = req.body && req.body.respostas;
    if (!respostas || typeof respostas !== "object") return res.status(400).json({ erro: "respostas inválidas" });
    const codigos = Object.keys(respostas).slice(0, 100);
    const { rows } = await pool.query("SELECT * FROM questoes WHERE codigo = ANY($1)", [codigos]);
    const porMateria = {};
    for (const r of rows) {
      const m = (porMateria[r.materia_sigla] ||= { total: 0, acertos: 0, erradas: [] });
      m.total++;
      if (Number(respostas[r.codigo]) === r.indice_correta) m.acertos++;
      else m.erradas.push({ id: r.codigo, topic: r.subtopico, explanation: r.comentario });
    }
    for (const m of Object.values(porMateria)) m.percentual = Math.round((m.acertos / m.total) * 100);
    res.json(porMateria);
  } catch (e) { next(e); }
});

// ---- Admin ----
const validar = (b) =>
  b &&
  SUBJECTS.includes(b.subject) &&
  typeof b.topic === "string" && b.topic.length <= 120 &&
  typeof b.stem === "string" && b.stem.length <= 2000 &&
  Array.isArray(b.options) && b.options.length === 4 && b.options.every((o) => typeof o === "string" && o.length <= 500) &&
  Number.isInteger(b.correct) && b.correct >= 0 && b.correct <= 3;

// Usado pela tela de login do site para validar o token
app.get("/admin/check", requireAdmin, (_req, res) => res.json({ ok: true }));

app.post("/questoes", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body;
    if (!validar(b)) return res.status(400).json({ erro: "dados inválidos" });
    const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM questoes WHERE materia_sigla=$1", [b.subject]);
    const codigo = `${b.subject}-${String(rows[0].n + 1).padStart(2, "0")}-${Date.now().toString(36)}`;
    await pool.query(
      `INSERT INTO questoes (codigo, materia_sigla, subtopico, dificuldade, enunciado, alternativas, indice_correta, comentario)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [codigo, b.subject, b.topic, String(b.difficulty || "Banca ANAC").slice(0, 30), b.stem, JSON.stringify(b.options), b.correct, String(b.explanation || "").slice(0, 2000)]
    );
    res.status(201).json({ id: codigo });
  } catch (e) { next(e); }
});

app.delete("/questoes/:codigo", requireAdmin, async (req, res, next) => {
  try {
    const r = await pool.query("DELETE FROM questoes WHERE codigo=$1", [req.params.codigo]);
    res.json({ removidas: r.rowCount });
  } catch (e) { next(e); }
});

app.use((_req, res) => res.status(404).json({ erro: "Rota não encontrada" }));
// Não vaza detalhes de erro ao cliente
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API escutando em 0.0.0.0:${PORT}`);
  init()
    .then(() => {
      dbStatus = "connected";
      console.log("Banco PostgreSQL inicializado com sucesso");
    })
    .catch((e) => {
      dbStatus = `error: ${e.message}`;
      console.error("Aviso ao conectar no banco:", e.message);
    });
});
