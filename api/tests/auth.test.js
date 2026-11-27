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

test('signToken and verifyToken validate HMAC signature, token version, minimization, and expiration', () => {
  const secret = 'segredo-teste-aerobanca';
  const token = signToken({ uid: 42, tv: 3, email: 'piloto@anac.br' }, secret, 3600);
  // Minimização LGPD: e-mail não deve aparecer no payload base64url do token
  const rawPayload = Buffer.from(token.split('.')[0], 'base64url').toString('utf8');
  assert.equal(rawPayload.includes('piloto@anac.br'), false);

  const decoded = verifyToken(token, secret);
  assert.equal(decoded.uid, 42);
  assert.equal(decoded.tv, 3);
  assert.equal('email' in decoded, false);
  assert.equal(verifyToken(token, 'outro-segredo'), null);
  assert.equal(verifyToken(token.slice(0, -2) + 'xx', secret), null);

  const expired = signToken({ uid: 42, tv: 1 }, secret, -10);
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

test('resolveAuthSecret prefers explicit authSecret, derives fallback in dev, and throws in production', () => {
  const explicit = resolveAuthSecret({ authSecret: 'meu-segredo', adminToken: 'adm', nodeEnv: 'production' });
  assert.equal(explicit.secret, 'meu-segredo');
  assert.equal(explicit.isFallback, false);

  const fb1 = resolveAuthSecret({ adminToken: 'adm', databaseUrl: 'pg://x', nodeEnv: 'development' });
  const fb2 = resolveAuthSecret({ adminToken: 'adm', databaseUrl: 'pg://x', nodeEnv: 'development' });
  assert.equal(fb1.isFallback, true);
  assert.equal(fb1.secret, fb2.secret);

  assert.throws(
    () => resolveAuthSecret({ adminToken: 'adm', databaseUrl: 'pg://x', nodeEnv: 'production' }),
    /AUTH_SECRET/
  );
});
