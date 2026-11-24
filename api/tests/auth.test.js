// api/tests/auth.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  VALID_CAREERS,
  normalizeEmail,
  isValidEmail,
  isValidCareer,
  hashPassword,
  verifyPassword,
  resolveAuthSecret,
  signToken,
  verifyToken
} = require('../src/auth');

test('hashPassword produces unique salted scrypt hashes and verifyPassword validates correctly', () => {
  const h1 = hashPassword('Aviao123!');
  const h2 = hashPassword('Aviao123!');
  assert.match(h1, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  assert.notEqual(h1, h2);
  assert.equal(verifyPassword('Aviao123!', h1), true);
  assert.equal(verifyPassword('Errada123', h1), false);
  assert.equal(verifyPassword('Aviao123!', 'invalido'), false);
});

test('signToken and verifyToken validate HMAC signature and expiration', () => {
  const secret = 'segredo-teste-aerobanca';
  const token = signToken({ uid: 42, email: 'piloto@anac.br' }, secret, 3600);
  const decoded = verifyToken(token, secret);
  assert.equal(decoded.uid, 42);
  assert.equal(decoded.email, 'piloto@anac.br');
  assert.equal(verifyToken(token, 'outro-segredo'), null);
  assert.equal(verifyToken(token.slice(0, -2) + 'xx', secret), null);

  const expired = signToken({ uid: 42, email: 'piloto@anac.br' }, secret, -10);
  assert.equal(verifyToken(expired, secret), null);
});

test('email and career validators enforce PP/PC/CMS and normalized email', () => {
  assert.deepEqual(VALID_CAREERS, ['PP', 'PC', 'CMS']);
  assert.equal(normalizeEmail(' Piloto@Exemplo.COM '), 'piloto@exemplo.com');
  assert.equal(isValidEmail('piloto@exemplo.com'), true);
  assert.equal(isValidEmail('invalido'), false);
  assert.equal(isValidCareer('PP'), true);
  assert.equal(isValidCareer('PC'), true);
  assert.equal(isValidCareer('CMS'), true);
  assert.equal(isValidCareer('PLA'), false);
});

test('resolveAuthSecret prefers explicit authSecret and derives deterministic fallback otherwise', () => {
  const explicit = resolveAuthSecret({ authSecret: 'meu-segredo', adminToken: 'adm' });
  assert.equal(explicit.secret, 'meu-segredo');
  assert.equal(explicit.isFallback, false);

  const fb1 = resolveAuthSecret({ adminToken: 'adm', databaseUrl: 'pg://x' });
  const fb2 = resolveAuthSecret({ adminToken: 'adm', databaseUrl: 'pg://x' });
  assert.equal(fb1.isFallback, true);
  assert.equal(fb1.secret, fb2.secret);
});
