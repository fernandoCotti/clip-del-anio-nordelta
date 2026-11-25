import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE_NAME = 'adminSession';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours, in seconds

// The session is signed with ADMIN_PASSWORD, so changing the password
// invalidates every existing admin session.
function getSecret(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  return secret && secret.length > 0 ? secret : null;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: unknown): boolean {
  const secret = getSecret();
  if (!secret || typeof password !== 'string') return false;
  return safeEqual(password, secret);
}

// Token format: "<expiresAtMs>.<HMAC-SHA256 signature>"
export function createAdminSessionToken(): string {
  const secret = getSecret();
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured');
  const expiresAt = String(Date.now() + ADMIN_SESSION_MAX_AGE * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function isValidAdminSessionToken(token: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;
  if (!safeEqual(signature, sign(expiresAt, secret))) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}
