// api/tests/db.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { SCHEMA, init } = require('../src/db');

test('SCHEMA defines usuarios and tentativas_simulado tables with constraints and index', () => {
  assert.match(SCHEMA, /CREATE TABLE IF NOT EXISTS materias/i);
  assert.match(SCHEMA, /CREATE TABLE IF NOT EXISTS questoes/i);
  assert.match(SCHEMA, /CREATE TABLE IF NOT EXISTS usuarios/i);
  assert.match(SCHEMA, /nome\s+VARCHAR\(120\)\s+NOT NULL/i);
  assert.match(SCHEMA, /email\s+VARCHAR\(180\)\s+UNIQUE\s+NOT NULL/i);
  assert.match(SCHEMA, /senha_hash\s+TEXT\s+NOT NULL/i);
  assert.match(SCHEMA, /carreira\s+VARCHAR\(10\)\s+NOT NULL\s+CHECK\s*\(carreira IN \('PP',\s*'PC',\s*'CMS'\)\)/i);
  assert.match(SCHEMA, /nivelamento_concluido\s+BOOLEAN\s+NOT NULL\s+DEFAULT\s+FALSE/i);
  assert.match(SCHEMA, /token_version\s+INTEGER\s+NOT NULL\s+DEFAULT\s+1/i);
  assert.match(SCHEMA, /privacidade_aceita_em\s+TIMESTAMPTZ/i);
  assert.match(SCHEMA, /privacidade_versao\s+VARCHAR\(20\)/i);
  assert.match(SCHEMA, /ultimo_acesso_em\s+TIMESTAMPTZ\s+NOT NULL\s+DEFAULT\s+NOW\(\)/i);
  assert.match(SCHEMA, /CREATE TABLE IF NOT EXISTS tentativas_simulado/i);
  assert.match(SCHEMA, /usuario_id\s+INTEGER\s+NOT NULL\s+REFERENCES\s+usuarios\(id\)\s+ON DELETE CASCADE/i);
  assert.match(SCHEMA, /tipo\s+VARCHAR\(20\)\s+NOT NULL\s+CHECK\s*\(tipo IN \('nivelamento',\s*'personalizado'\)\)/i);
  assert.match(SCHEMA, /total_questoes\s+INTEGER\s+NOT NULL\s+CHECK\s*\(total_questoes > 0\)/i);
  assert.match(SCHEMA, /total_acertos\s+INTEGER\s+NOT NULL\s+CHECK\s*\(total_acertos >= 0\)/i);
  assert.match(SCHEMA, /percentual\s+INTEGER\s+NOT NULL\s+CHECK\s*\(percentual BETWEEN 0 AND 100\)/i);
  assert.match(SCHEMA, /detalhes_materias\s+JSONB\s+NOT NULL/i);
  assert.match(SCHEMA, /CREATE INDEX IF NOT EXISTS idx_tentativas_usuario_data\s+ON\s+tentativas_simulado\(usuario_id,\s*criado_em DESC\)/i);
  assert.match(SCHEMA, /CREATE TABLE IF NOT EXISTS audit_logs/i);
  assert.match(SCHEMA, /CREATE INDEX IF NOT EXISTS idx_audit_logs_usuario_data\s+ON\s+audit_logs\(usuario_id,\s*criado_em DESC\)/i);
});

test('init runs SCHEMA and skips seed when questoes already exist', async () => {
  const queries = [];
  const mockPool = {
    async query(sql, params) {
      queries.push({ sql, params });
      if (sql.includes('COUNT(*)')) return { rows: [{ n: 30 }] };
      return { rows: [] };
    }
  };
  await init(mockPool);
  assert.equal(queries.length, 2);
  assert.equal(queries[0].sql, SCHEMA);
});

test('init seeds materias and questoes when questoes table is empty', async () => {
  const queries = [];
  const mockPool = {
    async query(sql, params) {
      queries.push({ sql, params });
      if (sql.includes('COUNT(*)')) return { rows: [{ n: 0 }] };
      return { rows: [] };
    }
  };
  await init(mockPool);
  const materiaInserts = queries.filter((q) => q.sql.includes('INSERT INTO materias'));
  const questaoInserts = queries.filter((q) => q.sql.includes('INSERT INTO questoes'));
  assert.equal(materiaInserts.length, 5);
  assert.equal(questaoInserts.length, 30);
});
