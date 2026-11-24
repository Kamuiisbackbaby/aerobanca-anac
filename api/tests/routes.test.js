// api/tests/routes.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const seed = require('../src/seed-data.json');
const { signToken } = require('../src/auth');
const serverModule = require('../src/server');

const AUTH_SECRET = 'test-auth-secret-aerobanca';
const ADMIN_TOKEN = 'test-admin-secret-aerobanca';

function createMockPool() {
  const state = {
    nextUserId: 1,
    nextQuestaoId: 1,
    nextTentativaId: 1,
    clockMs: Date.UTC(2026, 10, 24, 12, 0, 0),
    usuarios: [],
    tentativas: [],
    questoes: seed.questoes.map((q, idx) => ({
      id: idx + 1,
      codigo: q.id,
      materia_sigla: q.subject,
      subtopico: q.topic,
      dificuldade: q.difficulty,
      enunciado: q.stem,
      alternativas: [...q.options],
      indice_correta: q.correct,
      comentario: q.explanation,
      criado_em: new Date(Date.UTC(2026, 10, 1, 0, idx, 0)),
    })),
  };
  state.nextQuestaoId = state.questoes.length + 1;

  const pool = {
    state,
    async query(rawSql, params = []) {
      const sql = rawSql.replace(/\s+/g, ' ').trim();

      // Admin list questoes
      if (/^SELECT \* FROM questoes ORDER BY criado_em DESC, codigo$/i.test(sql)) {
        const rows = [...state.questoes].sort((a, b) => {
          const diff = b.criado_em.getTime() - a.criado_em.getTime();
          return diff !== 0 ? diff : a.codigo.localeCompare(b.codigo);
        });
        return { rows };
      }

      // List questoes filtered by materia
      if (/^SELECT \* FROM questoes WHERE materia_sigla=\$1 ORDER BY codigo$/i.test(sql)) {
        const rows = state.questoes
          .filter((q) => q.materia_sigla === params[0])
          .sort((a, b) => a.codigo.localeCompare(b.codigo));
        return { rows };
      }

      // List all questoes
      if (/^SELECT \* FROM questoes ORDER BY materia_sigla, codigo$/i.test(sql)) {
        const rows = [...state.questoes].sort(
          (a, b) => a.materia_sigla.localeCompare(b.materia_sigla) || a.codigo.localeCompare(b.codigo)
        );
        return { rows };
      }

      // Simulado nivelamento (6 per subject)
      if (/ROW_NUMBER\(\) OVER \(PARTITION BY materia_sigla ORDER BY RANDOM\(\)\)/i.test(sql)) {
        const bySubject = new Map();
        for (const q of state.questoes) {
          if (!bySubject.has(q.materia_sigla)) bySubject.set(q.materia_sigla, []);
          bySubject.get(q.materia_sigla).push(q);
        }
        const rows = [];
        for (const subject of [...bySubject.keys()].sort()) {
          rows.push(...bySubject.get(subject).slice(0, 6));
        }
        return { rows };
      }

      // Simulado personalizado
      if (/^SELECT \* FROM questoes WHERE materia_sigla = ANY\(\$1\) ORDER BY RANDOM\(\) LIMIT \$2$/i.test(sql)) {
        const subjects = new Set(params[0]);
        const limit = Number(params[1]);
        const rows = state.questoes.filter((q) => subjects.has(q.materia_sigla)).slice(0, limit);
        return { rows };
      }

      // Lookup questions by codes (corrigir)
      if (/^SELECT \* FROM questoes WHERE codigo = ANY\(\$1\)$/i.test(sql)) {
        const codes = new Set(params[0]);
        const rows = state.questoes.filter((q) => codes.has(q.codigo));
        return { rows };
      }

      // Lookup single question for answer check
      if (/^SELECT codigo, indice_correta, comentario FROM questoes WHERE codigo = \$1$/i.test(sql)) {
        const row = state.questoes.find((q) => q.codigo === params[0]);
        return {
          rows: row
            ? [{ codigo: row.codigo, indice_correta: row.indice_correta, comentario: row.comentario }]
            : [],
        };
      }

      // Admin count questoes by materia
      if (/^SELECT COUNT\(\*\)::int AS n FROM questoes WHERE materia_sigla=\$1$/i.test(sql)) {
        const n = state.questoes.filter((q) => q.materia_sigla === params[0]).length;
        return { rows: [{ n }] };
      }

      // Admin insert questao
      if (/^INSERT INTO questoes /i.test(sql)) {
        const row = {
          id: state.nextQuestaoId++,
          codigo: params[0],
          materia_sigla: params[1],
          subtopico: params[2],
          dificuldade: params[3],
          enunciado: params[4],
          alternativas: JSON.parse(params[5]),
          indice_correta: params[6],
          comentario: params[7],
          criado_em: new Date((state.clockMs += 1000)),
        };
        state.questoes.push(row);
        return { rows: [], rowCount: 1 };
      }

      // Admin delete questao
      if (/^DELETE FROM questoes WHERE codigo=\$1$/i.test(sql)) {
        const before = state.questoes.length;
        state.questoes = state.questoes.filter((q) => q.codigo !== params[0]);
        return { rows: [], rowCount: before - state.questoes.length };
      }

      // Select user id by email
      if (/^SELECT id FROM usuarios WHERE email = \$1$/i.test(sql)) {
        const user = state.usuarios.find((u) => u.email === params[0]);
        return { rows: user ? [{ id: user.id }] : [] };
      }

      // Select user with senha_hash by email
      if (/^SELECT id, nome, email, senha_hash, carreira, nivelamento_concluido FROM usuarios WHERE email = \$1$/i.test(sql)) {
        const user = state.usuarios.find((u) => u.email === params[0]);
        return { rows: user ? [{ ...user }] : [] };
      }

      // Select user by id
      if (/^SELECT id, nome, email, carreira, nivelamento_concluido FROM usuarios WHERE id = \$1$/i.test(sql)) {
        const user = state.usuarios.find((u) => u.id === params[0]);
        if (!user) return { rows: [] };
        const { id, nome, email, carreira, nivelamento_concluido } = user;
        return { rows: [{ id, nome, email, carreira, nivelamento_concluido }] };
      }

      // Insert user
      if (/^INSERT INTO usuarios /i.test(sql)) {
        const [nome, email, senha_hash, carreira] = params;
        if (state.usuarios.some((u) => u.email === email)) {
          const err = new Error('duplicate key value violates unique constraint');
          err.code = '23505';
          throw err;
        }
        const user = {
          id: state.nextUserId++,
          nome,
          email,
          senha_hash,
          carreira,
          nivelamento_concluido: false,
          criado_em: new Date((state.clockMs += 1000)),
        };
        state.usuarios.push(user);
        return {
          rows: [
            {
              id: user.id,
              nome: user.nome,
              email: user.email,
              carreira: user.carreira,
              nivelamento_concluido: user.nivelamento_concluido,
            },
          ],
        };
      }

      // Update user career
      if (/^UPDATE usuarios SET carreira = \$1 WHERE id = \$2/i.test(sql)) {
        const user = state.usuarios.find((u) => u.id === params[1]);
        if (!user) return { rows: [] };
        user.carreira = params[0];
        return {
          rows: [
            {
              id: user.id,
              nome: user.nome,
              email: user.email,
              carreira: user.carreira,
              nivelamento_concluido: user.nivelamento_concluido,
            },
          ],
        };
      }

      // Mark nivelamento_concluido = TRUE
      if (/^UPDATE usuarios SET nivelamento_concluido = TRUE WHERE id = \$1$/i.test(sql)) {
        const user = state.usuarios.find((u) => u.id === params[0]);
        if (user) user.nivelamento_concluido = true;
        return { rows: [], rowCount: user ? 1 : 0 };
      }

      // Insert tentativa_simulado
      if (/^INSERT INTO tentativas_simulado /i.test(sql)) {
        const [usuario_id, tipo, carreira, total_questoes, total_acertos, percentual, detalhesRaw] = params;
        const row = {
          id: state.nextTentativaId++,
          usuario_id,
          tipo,
          carreira,
          total_questoes,
          total_acertos,
          percentual,
          detalhes_materias: typeof detalhesRaw === 'string' ? JSON.parse(detalhesRaw) : detalhesRaw,
          criado_em: new Date((state.clockMs += 1000)),
        };
        state.tentativas.push(row);
        return { rows: [{ id: row.id, criado_em: row.criado_em }] };
      }

      // Query tentativas_simulado by usuario_id
      if (/FROM tentativas_simulado WHERE usuario_id = \$1 ORDER BY criado_em DESC/i.test(sql)) {
        const rows = state.tentativas
          .filter((t) => t.usuario_id === params[0])
          .sort((a, b) => b.criado_em.getTime() - a.criado_em.getTime() || b.id - a.id);
        return { rows };
      }

      throw new Error(`Unexpected SQL in mockPool: ${sql}`);
    },
  };

  return pool;
}

async function startServer(t, extraOpts = {}) {
  assert.equal(typeof serverModule.createApp, 'function', 'server.js must export createApp');
  const pool = createMockPool();
  const app = serverModule.createApp({
    pool,
    authSecret: AUTH_SECRET,
    adminToken: ADMIN_TOKEN,
    frontendUrl: 'https://aerobanca.vercel.app',
    ...extraOpts,
  });

  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  async function api(path, { method = 'GET', body, token, headers = {} } = {}) {
    const reqHeaders = { ...headers };
    if (body !== undefined) reqHeaders['Content-Type'] = 'application/json';
    if (token !== undefined) reqHeaders.Authorization = `Bearer ${token}`;
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: reqHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = text;
    }
    return { status: res.status, headers: res.headers, body: json };
  }

  return { pool, app, baseUrl, api };
}

function buildAll30Answers(questoes, overrides = {}) {
  const answers = {};
  for (const q of questoes) {
    answers[q.codigo] = q.indice_correta;
  }
  return { ...answers, ...overrides };
}

test('health, public routes, CORS PATCH/Authorization, and admin routes are preserved', async (t) => {
  const { api } = await startServer(t);

  const health = await api('/health');
  assert.equal(health.status, 200);
  assert.equal(health.body.ok, true);

  const corsPreflight = await api('/auth/career', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://aerobanca.vercel.app',
      'Access-Control-Request-Method': 'PATCH',
      'Access-Control-Request-Headers': 'Content-Type, Authorization',
    },
  });
  assert.equal(corsPreflight.status, 204);
  assert.match(corsPreflight.headers.get('access-control-allow-methods') || '', /PATCH/);
  assert.match(corsPreflight.headers.get('access-control-allow-headers') || '', /Authorization/i);

  const list = await api('/questoes?materia=MET');
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 6);
  for (const q of list.body) {
    assert.equal(q.subject, 'MET');
    assert.equal('correct' in q, false);
    assert.equal('explanation' in q, false);
    assert.equal('indice_correta' in q, false);
    assert.equal('comentario' in q, false);
  }

  const sim = await api('/simulado');
  assert.equal(sim.status, 200);
  assert.equal(sim.body.length, 30);
  for (const q of sim.body) {
    assert.equal('correct' in q, false);
    assert.equal('explanation' in q, false);
  }

  const unauthAdmin = await api('/admin/check');
  assert.equal(unauthAdmin.status, 401);

  const okAdmin = await api('/admin/check', { token: ADMIN_TOKEN });
  assert.equal(okAdmin.status, 200);
  assert.equal(okAdmin.body.ok, true);

  const created = await api('/questoes', {
    method: 'POST',
    token: ADMIN_TOKEN,
    body: {
      subject: 'MET',
      topic: 'Teste Admin',
      stem: 'Pergunta de teste?',
      options: ['A', 'B', 'C', 'D'],
      correct: 2,
      explanation: 'Explicacao',
    },
  });
  assert.equal(created.status, 201);
  assert.match(created.body.id, /^MET-/);

  const adminList = await api('/admin/questoes', { token: ADMIN_TOKEN });
  assert.equal(adminList.status, 200);
  assert.equal(adminList.body[0].correct, 2);

  const removed = await api(`/questoes/${created.body.id}`, {
    method: 'DELETE',
    token: ADMIN_TOKEN,
  });
  assert.equal(removed.status, 200);
  assert.equal(removed.body.removidas, 1);
});

test('POST /auth/register validates career/inputs, hashes password, rejects duplicates, omits senha_hash', async (t) => {
  const { api, pool } = await startServer(t);

  const missingCareer = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Comandante', email: 'cmd@anac.br', senha: 'Senha123' },
  });
  assert.equal(missingCareer.status, 400);

  const invalidCareer = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Comandante', email: 'cmd@anac.br', senha: 'Senha123', carreira: 'PLA' },
  });
  assert.equal(invalidCareer.status, 400);

  const shortPass = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Comandante', email: 'cmd@anac.br', senha: '123', carreira: 'PP' },
  });
  assert.equal(shortPass.status, 400);

  const reg = await api('/auth/register', {
    method: 'POST',
    body: { nome: '  Ana Clara  ', email: ' Ana@ANAC.BR ', senha: 'Segredo123', carreira: 'PP' },
  });
  assert.equal(reg.status, 201);
  assert.ok(reg.body.token);
  assert.deepEqual(reg.body.user, {
    id: 1,
    nome: 'Ana Clara',
    email: 'ana@anac.br',
    carreira: 'PP',
    nivelamento_concluido: false,
  });
  assert.equal('senha_hash' in reg.body.user, false);
  assert.match(pool.state.usuarios[0].senha_hash, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);

  const dup = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Outra', email: 'ANA@anac.br', senha: 'Segredo123', carreira: 'PC' },
  });
  assert.equal(dup.status, 409);
});

test('POST /auth/login requires career, verifies credentials, and updates career if changed', async (t) => {
  const { api } = await startServer(t);

  await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Marcos', email: 'marcos@anac.br', senha: 'VooSeguro99', carreira: 'PP' },
  });

  const missingCareer = await api('/auth/login', {
    method: 'POST',
    body: { email: 'marcos@anac.br', senha: 'VooSeguro99' },
  });
  assert.equal(missingCareer.status, 400);

  const invalidCareer = await api('/auth/login', {
    method: 'POST',
    body: { email: 'marcos@anac.br', senha: 'VooSeguro99', carreira: 'ATP' },
  });
  assert.equal(invalidCareer.status, 400);

  const wrongPass = await api('/auth/login', {
    method: 'POST',
    body: { email: 'marcos@anac.br', senha: 'Errada123', carreira: 'PP' },
  });
  assert.equal(wrongPass.status, 401);

  const unknownEmail = await api('/auth/login', {
    method: 'POST',
    body: { email: 'naoexiste@anac.br', senha: 'VooSeguro99', carreira: 'PP' },
  });
  assert.equal(unknownEmail.status, 401);
  assert.equal(wrongPass.body.erro, unknownEmail.body.erro);

  const loginChangedCareer = await api('/auth/login', {
    method: 'POST',
    body: { email: 'MARCOS@ANAC.BR', senha: 'VooSeguro99', carreira: 'CMS' },
  });
  assert.equal(loginChangedCareer.status, 200);
  assert.ok(loginChangedCareer.body.token);
  assert.equal(loginChangedCareer.body.user.carreira, 'CMS');
  assert.equal('senha_hash' in loginChangedCareer.body.user, false);
});

test('protected routes reject missing, malformed, tampered, and expired Bearer tokens with 401', async (t) => {
  const { api } = await startServer(t);
  const reg = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Piloto', email: 'piloto@anac.br', senha: 'Senha123', carreira: 'PC' },
  });
  const validToken = reg.body.token;
  const tamperedToken = validToken.slice(0, -2) + (validToken.endsWith('aa') ? 'bb' : 'aa');
  const expiredToken = signToken({ uid: reg.body.user.id, email: reg.body.user.email }, AUTH_SECRET, -10);
  const ghostUserToken = signToken({ uid: 9999, email: 'ghost@anac.br' }, AUTH_SECRET, 3600);

  const protectedCalls = [
    { method: 'GET', path: '/auth/me' },
    { method: 'PATCH', path: '/auth/career', body: { carreira: 'PP' } },
    { method: 'GET', path: '/simulado/personalizado' },
    { method: 'POST', path: '/simulado/corrigir', body: { tipo: 'personalizado', questoes: ['MET-01'], respostas: { 'MET-01': 1 } } },
    { method: 'POST', path: '/questoes/MET-01/responder', body: { alternativa: 1 } },
    { method: 'GET', path: '/metricas' },
  ];

  const badTokens = [undefined, '', 'not-a-jwt', tamperedToken, expiredToken, ghostUserToken];

  for (const call of protectedCalls) {
    for (const badToken of badTokens) {
      const res = await api(call.path, { method: call.method, body: call.body, token: badToken });
      assert.equal(res.status, 401, `Expected 401 on ${call.method} ${call.path} with token=${badToken}`);
    }
  }

  const nonBearer = await api('/auth/me', { headers: { Authorization: `Basic ${validToken}` } });
  assert.equal(nonBearer.status, 401);

  const me = await api('/auth/me', { token: validToken });
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'piloto@anac.br');

  const badCareerPatch = await api('/auth/career', {
    method: 'PATCH',
    token: validToken,
    body: { carreira: 'INVALID' },
  });
  assert.equal(badCareerPatch.status, 400);

  const okCareerPatch = await api('/auth/career', {
    method: 'PATCH',
    token: validToken,
    body: { carreira: 'CMS' },
  });
  assert.equal(okCareerPatch.status, 200);
  assert.equal(okCareerPatch.body.user.carreira, 'CMS');
});

test('GET /simulado/personalizado omits answers and POST /questoes/:codigo/responder validates answers', async (t) => {
  const { api } = await startServer(t);
  const reg = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Aluno', email: 'aluno@anac.br', senha: 'Senha123', carreira: 'PP' },
  });
  const token = reg.body.token;

  const defaultCustom = await api('/simulado/personalizado', { token });
  assert.equal(defaultCustom.status, 200);
  assert.equal(defaultCustom.body.length, 10);

  const clampedMin = await api('/simulado/personalizado?quantidade=1', { token });
  assert.equal(clampedMin.status, 200);
  assert.equal(clampedMin.body.length, 5);

  const custom = await api('/simulado/personalizado?materias=MET,NAV&quantidade=8', { token });
  assert.equal(custom.status, 200);
  assert.equal(custom.body.length, 8);
  for (const q of custom.body) {
    assert.ok(['MET', 'NAV'].includes(q.subject));
    assert.equal('correct' in q, false);
    assert.equal('explanation' in q, false);
    assert.equal('indice_correta' in q, false);
    assert.equal('comentario' in q, false);
  }

  const invalidSubject = await api('/simulado/personalizado?materias=XYZ', { token });
  assert.equal(invalidSubject.status, 400);

  for (const badAlt of [4, -1, '1', null, undefined]) {
    const invalidAlt = await api('/questoes/MET-01/responder', {
      method: 'POST',
      token,
      body: { alternativa: badAlt },
    });
    assert.equal(invalidAlt.status, 400, `Expected 400 for alternativa=${JSON.stringify(badAlt)}`);
  }

  const notFound = await api('/questoes/NOPE-99/responder', {
    method: 'POST',
    token,
    body: { alternativa: 0 },
  });
  assert.equal(notFound.status, 404);

  const right = await api('/questoes/MET-01/responder', {
    method: 'POST',
    token,
    body: { alternativa: 1 },
  });
  assert.equal(right.status, 200);
  assert.equal(right.body.correta, true);
  assert.equal(right.body.indice_correta, 1);
  assert.ok(typeof right.body.comentario === 'string' && right.body.comentario.length > 0);

  const wrong = await api('/questoes/MET-01/responder', {
    method: 'POST',
    token,
    body: { alternativa: 0 },
  });
  assert.equal(wrong.status, 200);
  assert.equal(wrong.body.correta, false);
  assert.equal(wrong.body.indice_correta, 1);
});

test('POST /simulado/corrigir enforces nivelamento integrity and counts blank personalizado answers as wrong', async (t) => {
  const { api, pool } = await startServer(t);
  const reg = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Cadete', email: 'cadete@anac.br', senha: 'Senha123', carreira: 'PP' },
  });
  const token = reg.body.token;
  const all30 = pool.state.questoes.slice(0, 30);
  const all30Codes = all30.map((q) => q.codigo);

  // Empty questoes -> 400
  const emptyCustom = await api('/simulado/corrigir', {
    method: 'POST',
    token,
    body: { tipo: 'personalizado', questoes: [], respostas: {} },
  });
  assert.equal(emptyCustom.status, 400);

  // Nivelamento with < 30 questoes -> 400 and does NOT flip nivelamento_concluido
  const shortNiv = await api('/simulado/corrigir', {
    method: 'POST',
    token,
    body: {
      tipo: 'nivelamento',
      questoes: all30Codes.slice(0, 29),
      respostas: buildAll30Answers(all30.slice(0, 29)),
    },
  });
  assert.equal(shortNiv.status, 400);

  // Nivelamento with 30 questoes but 1 missing answer -> 400
  const partialAnswers = buildAll30Answers(all30);
  delete partialAnswers[all30Codes[29]];
  const partialNiv = await api('/simulado/corrigir', {
    method: 'POST',
    token,
    body: { tipo: 'nivelamento', questoes: all30Codes, respostas: partialAnswers },
  });
  assert.equal(partialNiv.status, 400);

  // Nivelamento with forged question code -> 400
  const forgedCodes = [...all30Codes.slice(0, 29), 'FAKE-99'];
  const forgedNiv = await api('/simulado/corrigir', {
    method: 'POST',
    token,
    body: {
      tipo: 'nivelamento',
      questoes: forgedCodes,
      respostas: { ...buildAll30Answers(all30.slice(0, 29)), 'FAKE-99': 0 },
    },
  });
  assert.equal(forgedNiv.status, 400);

  const stillLocked = await api('/auth/me', { token });
  assert.equal(stillLocked.body.user.nivelamento_concluido, false);
  assert.equal(pool.state.tentativas.length, 0);

  // Complete 30-question nivelamento (24 right, 6 wrong -> 80%)
  const nivAnswers = buildAll30Answers(all30, {
    'MET-01': (all30[0].indice_correta + 1) % 4,
    'MET-02': (all30[1].indice_correta + 1) % 4,
    'NAV-01': (all30[6].indice_correta + 1) % 4,
    'NAV-02': (all30[7].indice_correta + 1) % 4,
    'RPA-01': (all30[12].indice_correta + 1) % 4,
    'CT-01': (all30[18].indice_correta + 1) % 4,
  });
  const okNiv = await api('/simulado/corrigir', {
    method: 'POST',
    token,
    body: { tipo: 'nivelamento', questoes: all30Codes, respostas: nivAnswers },
  });
  assert.equal(okNiv.status, 200);
  assert.equal(okNiv.body.tipo, 'nivelamento');
  assert.equal(okNiv.body.carreira, 'PP');
  assert.equal(okNiv.body.total_questoes, 30);
  assert.equal(okNiv.body.total_acertos, 24);
  assert.equal(okNiv.body.percentual, 80);
  assert.equal(okNiv.body.nivelamento_concluido, true);
  assert.ok(okNiv.body.tentativaId);
  assert.equal(okNiv.body.porMateria.MET.acertos, 4);
  assert.equal(okNiv.body.porMateria.MET.total, 6);
  assert.equal(okNiv.body.porMateria.MET.percentual, 67);

  const unlocked = await api('/auth/me', { token });
  assert.equal(unlocked.body.user.nivelamento_concluido, true);

  // Personalizado with duplicate code, unanswered question, and null answer (even when correct === 0!)
  // MET-04 has correct === 0, so passing null must NOT score as correct!
  const customRes = await api('/simulado/corrigir', {
    method: 'POST',
    token,
    body: {
      tipo: 'personalizado',
      questoes: ['MET-01', 'MET-01', 'MET-02', 'MET-04', 'NAV-01'],
      respostas: {
        'MET-01': 1, // correct
        'MET-02': 0, // wrong (correct is 1)
        'MET-04': null, // blank/null (correct is 0 -> must count wrong!)
        // 'NAV-01' omitted -> must count wrong!
      },
    },
  });
  assert.equal(customRes.status, 200);
  assert.equal(customRes.body.total_questoes, 4);
  assert.equal(customRes.body.total_acertos, 1);
  assert.equal(customRes.body.percentual, 25);
});

test('GET /metricas scopes by user, uses ultimoPercentual consistently, and caps historico at 10', async (t) => {
  const { api, pool } = await startServer(t);

  const userAReg = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Piloto A', email: 'a@anac.br', senha: 'Senha123', carreira: 'PP' },
  });
  const tokenA = userAReg.body.token;

  const userBReg = await api('/auth/register', {
    method: 'POST',
    body: { nome: 'Piloto B', email: 'b@anac.br', senha: 'Senha123', carreira: 'PC' },
  });
  const tokenB = userBReg.body.token;

  // Empty metrics for fresh user A
  const emptyMetrics = await api('/metricas', { token: tokenA });
  assert.equal(emptyMetrics.status, 200);
  assert.equal(emptyMetrics.body.resumo.totalSimulados, 0);
  assert.equal(emptyMetrics.body.resumo.materiasAprovadas, 0);
  assert.equal(emptyMetrics.body.resumo.materiaCritica, null);
  assert.deepEqual(emptyMetrics.body.pontosFracos, []);
  assert.deepEqual(emptyMetrics.body.historico, []);
  assert.equal(emptyMetrics.body.porMateria.MET.ultimoPercentual, null);
  assert.equal(emptyMetrics.body.porMateria.MET.mediaAcumulada, null);

  const all30 = pool.state.questoes.slice(0, 30);
  const all30Codes = all30.map((q) => q.codigo);

  // Attempt 1 (User A nivelamento):
  // MET: 1/6 (17%), NAV: 2/6 (33%), RPA: 5/6 (83%), CT: 6/6 (100%), TSV: 5/6 (83%)
  const wrongFirst = (list, count) => {
    const out = {};
    for (let i = 0; i < count; i++) out[list[i].codigo] = (list[i].indice_correta + 1) % 4;
    return out;
  };
  const nivA = buildAll30Answers(all30, {
    ...wrongFirst(all30.filter((q) => q.materia_sigla === 'MET'), 5),
    ...wrongFirst(all30.filter((q) => q.materia_sigla === 'NAV'), 4),
    ...wrongFirst(all30.filter((q) => q.materia_sigla === 'RPA'), 1),
    ...wrongFirst(all30.filter((q) => q.materia_sigla === 'TSV'), 1),
  });
  await api('/simulado/corrigir', {
    method: 'POST',
    token: tokenA,
    body: { tipo: 'nivelamento', questoes: all30Codes, respostas: nivA },
  });

  // User B attempt should NEVER leak into User A's metrics
  await api('/simulado/corrigir', {
    method: 'POST',
    token: tokenB,
    body: { tipo: 'nivelamento', questoes: all30Codes, respostas: buildAll30Answers(all30) },
  });

  // Attempt 2 (User A personalizado):
  // MET: 6/6 (100% -> mediaAcumulada = 7/12 = 58%, ultimoPercentual = 100%)
  // RPA: 2/4 (50% -> mediaAcumulada = 7/10 = 70%, ultimoPercentual = 50%)
  const met6 = all30.filter((q) => q.materia_sigla === 'MET');
  const rpa4 = all30.filter((q) => q.materia_sigla === 'RPA').slice(0, 4);
  const customA2 = buildAll30Answers([...met6, ...rpa4], {
    ...wrongFirst(rpa4, 2),
  });
  await api('/simulado/corrigir', {
    method: 'POST',
    token: tokenA,
    body: {
      tipo: 'personalizado',
      questoes: [...met6, ...rpa4].map((q) => q.codigo),
      respostas: customA2,
    },
  });

  const metricsA = await api('/metricas', { token: tokenA });
  assert.equal(metricsA.status, 200);
  assert.equal(metricsA.body.resumo.totalSimulados, 2);
  // Approved by ultimoPercentual >= 70: MET (100), CT (100), TSV (83) -> 3!
  // Note: MET has mediaAcumulada 58 (<70) yet ultimoPercentual 100 (>=70); RPA has mediaAcumulada 70 yet ultimoPercentual 50 (<70).
  assert.equal(metricsA.body.porMateria.MET.ultimoPercentual, 100);
  assert.equal(metricsA.body.porMateria.MET.mediaAcumulada, 58);
  assert.equal(metricsA.body.porMateria.RPA.ultimoPercentual, 50);
  assert.equal(metricsA.body.porMateria.RPA.mediaAcumulada, 70);
  assert.equal(metricsA.body.porMateria.NAV.ultimoPercentual, 33);
  assert.equal(metricsA.body.resumo.materiasAprovadas, 3);
  assert.equal(metricsA.body.resumo.materiaCritica.sigla, 'NAV');
  assert.equal(metricsA.body.resumo.materiaCritica.ultimoPercentual, 33);
  assert.deepEqual(
    metricsA.body.pontosFracos.map((p) => p.sigla),
    ['NAV', 'RPA']
  );
  assert.ok(metricsA.body.pontosFracos[0].subtopicosErrados.length > 0);
  assert.equal(metricsA.body.historico.length, 2);

  // Add 10 more attempts on CT only (preserving MET/NAV/RPA/TSV ultimoPercentual) to verify 10-item cap
  for (let i = 0; i < 10; i++) {
    await api('/simulado/corrigir', {
      method: 'POST',
      token: tokenA,
      body: {
        tipo: 'personalizado',
        questoes: ['CT-01'],
        respostas: { 'CT-01': 1 },
      },
    });
  }

  const capped = await api('/metricas', { token: tokenA });
  assert.equal(capped.body.resumo.totalSimulados, 12);
  assert.equal(capped.body.historico.length, 10);

  const metricsB = await api('/metricas', { token: tokenB });
  assert.equal(metricsB.body.resumo.totalSimulados, 1);
  assert.equal(metricsB.body.resumo.materiasAprovadas, 5);
});

test('authLimiter limits /auth/login and /auth/register to 20 requests per 15 min window', async (t) => {
  const { api } = await startServer(t);

  for (let i = 0; i < 20; i++) {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email: 'rate@anac.br', senha: 'WrongPassword', carreira: 'PP' },
    });
    assert.equal(res.status, 401);
  }

  const limited = await api('/auth/login', {
    method: 'POST',
    body: { email: 'rate@anac.br', senha: 'WrongPassword', carreira: 'PP' },
  });
  assert.equal(limited.status, 429);
});
