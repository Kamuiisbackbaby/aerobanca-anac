const { Pool } = require("pg");
const seed = require("./seed-data.json");

// O Railway injeta DATABASE_URL automaticamente quando você referencia o Postgres.
// Dentro do Railway a conexão é interna (sem SSL); localmente ou via URL pública exige SSL validado.
const isInternal = (process.env.DATABASE_URL || "").includes(".railway.internal");
const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false";
const sslConfig =
  process.env.DATABASE_URL && !isInternal
    ? {
        rejectUnauthorized,
        ...(process.env.DATABASE_SSL_CA ? { ca: process.env.DATABASE_SSL_CA } : {}),
      }
    : false;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS materias (
  sigla VARCHAR(5) PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS questoes (
  id             SERIAL PRIMARY KEY,
  codigo         VARCHAR(20) UNIQUE NOT NULL,
  materia_sigla  VARCHAR(5) NOT NULL REFERENCES materias(sigla),
  subtopico      VARCHAR(120) NOT NULL,
  dificuldade    VARCHAR(30) NOT NULL DEFAULT 'Banca ANAC',
  enunciado      TEXT NOT NULL,
  alternativas   JSONB NOT NULL,
  indice_correta SMALLINT NOT NULL CHECK (indice_correta BETWEEN 0 AND 3),
  comentario     TEXT,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_questoes_materia ON questoes(materia_sigla);
CREATE TABLE IF NOT EXISTS usuarios (
  id                    SERIAL PRIMARY KEY,
  nome                  VARCHAR(120) NOT NULL,
  email                 VARCHAR(180) UNIQUE NOT NULL,
  senha_hash            TEXT NOT NULL,
  carreira              VARCHAR(10) NOT NULL CHECK (carreira IN ('PP', 'PC', 'CMS')),
  nivelamento_concluido BOOLEAN NOT NULL DEFAULT FALSE,
  token_version         INTEGER NOT NULL DEFAULT 1,
  privacidade_aceita_em TIMESTAMPTZ,
  privacidade_versao    VARCHAR(20),
  ultimo_acesso_em      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS privacidade_aceita_em TIMESTAMPTZ;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS privacidade_versao VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultimo_acesso_em TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE TABLE IF NOT EXISTS tentativas_simulado (
  id                SERIAL PRIMARY KEY,
  usuario_id        INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo              VARCHAR(20) NOT NULL CHECK (tipo IN ('nivelamento', 'personalizado')),
  carreira          VARCHAR(10) NOT NULL CHECK (carreira IN ('PP', 'PC', 'CMS')),
  total_questoes    INTEGER NOT NULL CHECK (total_questoes > 0),
  total_acertos     INTEGER NOT NULL CHECK (total_acertos >= 0),
  percentual        INTEGER NOT NULL CHECK (percentual BETWEEN 0 AND 100),
  detalhes_materias JSONB NOT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tentativas_usuario_data ON tentativas_simulado(usuario_id, criado_em DESC);
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER,
  ator        VARCHAR(20) NOT NULL CHECK (ator IN ('usuario', 'admin', 'sistema')),
  acao        VARCHAR(60) NOT NULL,
  detalhes    JSONB,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_usuario_data ON audit_logs(usuario_id, criado_em DESC);
`;

// Cria as tabelas e, se estiverem vazias, carrega as 30 questões iniciais.
async function init(targetPool = pool) {
  await targetPool.query(SCHEMA);
  const { rows } = await targetPool.query("SELECT COUNT(*)::int AS n FROM questoes");
  if (rows[0].n > 0) return;
  for (const m of seed.materias) {
    await targetPool.query(
      "INSERT INTO materias (sigla, nome) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [m.sigla, m.nome]
    );
  }
  for (const q of seed.questoes) {
    await targetPool.query(
      `INSERT INTO questoes (codigo, materia_sigla, subtopico, dificuldade, enunciado, alternativas, indice_correta, comentario)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (codigo) DO NOTHING`,
      [q.id, q.subject, q.topic, q.difficulty, q.stem, JSON.stringify(q.options), q.correct, q.explanation]
    );
  }
  console.log(`Seed concluído: ${seed.questoes.length} questões`);
}

module.exports = { pool, init, SCHEMA };
