import { SignJWT, jwtVerify } from 'jose';
import crypto from 'node:crypto';
import type { UserRole } from '~/db/schema/schema';

/**
 * Hashes a plaintext password using Node's native scrypt.
 * Output format: <salt_hex>:<hash_hex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored scrypt hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// JWT Signing & Verification (jose)
// ---------------------------------------------------------------------------

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'super-secret-jwt-key-min-32-chars-long-siwaday-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

const ISSUER = 'urn:siwaday:issuer';
const AUDIENCE = 'urn:siwaday:audience';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
}

/**
 * Signs an access token (15-minute validity) containing authenticated user claims.
 */
export async function signAccessToken(payload: AuthUserPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
    avatarUrl: payload.avatarUrl,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

/**
 * Signs a refresh token (7-day validity) containing the user ID subject.
 */
export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ tokenType: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verifies an access token and returns its typed payload. Returns null if invalid or expired.
 */
export async function verifyAccessToken(token: string): Promise<AuthUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    if (!payload.sub || typeof payload.sub !== 'string') return null;

    return {
      id: payload.sub,
      email: String(payload.email || ''),
      role: (payload.role as UserRole) || 'moderator',
      fullName: String(payload.fullName || ''),
      avatarUrl: typeof payload.avatarUrl === 'string' ? payload.avatarUrl : null,
    };
  } catch {
    return null;
  }
}

/**
 * Verifies a refresh token and returns the subject user ID. Returns null if invalid or expired.
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    if (!payload.sub || typeof payload.sub !== 'string') return null;
    return { userId: payload.sub };
  } catch {
    return null;
  }
}
