const crypto = require("node:crypto");

const VALID_CAREERS = Object.freeze(["PP", "PC", "CMS"]);
const PRIVACY_VERSION = "2026-11";
const MIN_PASSWORD_LENGTH = 8;

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTES = 16;
const SCRYPT_HASH_REGEX = /^scrypt\$([0-9a-f]{32})\$([0-9a-f]{128})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes an email address by trimming whitespace and converting to lowercase.
 * @param {string} email
 * @returns {string}
 */
function normalizeEmail(email) {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Validates whether the provided value is a syntactically valid email address.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const normalized = normalizeEmail(email);
  return normalized.length > 0 && normalized.length <= 254 && EMAIL_REGEX.test(normalized);
}

/**
 * Validates whether the provided career is one of the supported ANAC careers.
 * @param {string} career
 * @returns {boolean}
 */
function isValidCareer(career) {
  return typeof career === "string" && VALID_CAREERS.includes(career);
}

/**
 * Hashes a plaintext password using scrypt with a random 16-byte salt.
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  if (typeof password !== "string") {
    throw new TypeError("Password must be a string");
  }
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

/**
 * Verifies a plaintext password against a stored `scrypt$<saltHex>$<hashHex>` string.
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean}
 */
function verifyPassword(password, storedHash) {
  if (typeof password !== "string" || typeof storedHash !== "string") {
    return false;
  }
  const match = SCRYPT_HASH_REGEX.exec(storedHash);
  if (!match) {
    return false;
  }
  const [, salt, hashHex] = match;
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  const expected = Buffer.from(hashHex, "hex");
  if (derived.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(derived, expected);
}

/**
 * Resolves the HMAC signing secret from explicit configuration or derives a deterministic fallback
 * in non-production environments. In production, AUTH_SECRET is strictly required.
 * @param {{ authSecret?: string, adminToken?: string, databaseUrl?: string, nodeEnv?: string }} [options]
 * @returns {{ secret: string, isFallback: boolean }}
 */
function resolveAuthSecret({ authSecret, adminToken, databaseUrl, nodeEnv = process.env.NODE_ENV } = {}) {
  const explicit = typeof authSecret === "string" ? authSecret.trim() : "";
  if (explicit) {
    return { secret: explicit, isFallback: false };
  }
  if (nodeEnv === "production") {
    throw new Error("AUTH_SECRET é obrigatório em ambiente de produção.");
  }
  const fallback = crypto
    .createHash("sha256")
    .update(`aerobanca-auth-fallback:${adminToken || ""}:${databaseUrl || ""}`)
    .digest("hex");
  return { secret: fallback, isFallback: true };
}

/**
 * Signs a minimized session payload (no PII like email) using HMAC-SHA256 and base64url encoding.
 * @param {{ uid: number, tv?: number }} payload
 * @param {string} secret
 * @param {number} [ttlSeconds]
 * @returns {string}
 */
function signToken(payload, secret, ttlSeconds = DEFAULT_TOKEN_TTL_SECONDS) {
  if (!secret || typeof secret !== "string") {
    throw new Error("Auth secret is required");
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  const tv = Number.isInteger(payload.tv) && payload.tv >= 1 ? payload.tv : 1;
  const body = {
    uid: payload.uid,
    tv,
    exp: nowSeconds + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed token and checks its expiration.
 * @param {string} token
 * @param {string} secret
 * @returns {{ uid: number, tv: number, exp: number } | null}
 */
function verifyToken(token, secret) {
  if (typeof token !== "string" || typeof secret !== "string" || !secret) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }
  const [encoded, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  const sigBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const tv = parsed && parsed.tv === undefined ? 1 : parsed && parsed.tv;
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Number.isInteger(parsed.uid) ||
    parsed.uid <= 0 ||
    !Number.isInteger(tv) ||
    tv < 1 ||
    typeof parsed.exp !== "number" ||
    !Number.isFinite(parsed.exp) ||
    parsed.exp <= nowSeconds
  ) {
    return null;
  }

  return { uid: parsed.uid, tv, exp: parsed.exp };
}

module.exports = {
  VALID_CAREERS,
  PRIVACY_VERSION,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  isValidEmail,
  isValidCareer,
  hashPassword,
  verifyPassword,
  resolveAuthSecret,
  signToken,
  verifyToken,
};
