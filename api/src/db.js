const { Pool } = require("pg");
const seed = require("./seed-data.json");

// O Railway injeta DATABASE_URL automaticamente quando você referencia o Postgres.
// Dentro do Railway a conexão é interna (sem SSL); localmente via URL pública exige SSL.
const isInternal = (process.env.DATABASE_URL || "").includes(".railway.internal");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !isInternal ? { rejectUnauthorized: false } : false,
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
`;

// Cria as tabelas e, se estiverem vazias, carrega as 30 questões iniciais.
async function init() {
  await pool.query(SCHEMA);
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM questoes");
  if (rows[0].n > 0) return;
  for (const m of seed.materias) {
    await pool.query(
      "INSERT INTO materias (sigla, nome) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [m.sigla, m.nome]
    );
  }
  for (const q of seed.questoes) {
    await pool.query(
      `INSERT INTO questoes (codigo, materia_sigla, subtopico, dificuldade, enunciado, alternativas, indice_correta, comentario)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (codigo) DO NOTHING`,
      [q.id, q.subject, q.topic, q.difficulty, q.stem, JSON.stringify(q.options), q.correct, q.explanation]
    );
  }
  console.log(`Seed concluído: ${seed.questoes.length} questões`);
}

module.exports = { pool, init };
