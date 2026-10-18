import { and, eq, isNull } from 'drizzle-orm';
import { redirect } from 'react-router';
import { db } from '~/db/index.server';
import { type UserRole, userProfiles, users } from '~/db/schema/schema';

import {
  type AuthUserPayload,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './auth.server';

export const ACCESS_COOKIE_NAME = 'siwaday_access_token';
export const REFRESH_COOKIE_NAME = 'siwaday_refresh_token';

// 15 minutes for access token, 7 days for refresh token
export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  secure?: boolean;
  path?: string;
}

/**
 * Serializes a cookie name, value, and options into a Set-Cookie header string.
 */
export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const {
    maxAge,
    httpOnly = true,
    sameSite = 'lax',
    secure = process.env.NODE_ENV === 'production',
    path = '/',
  } = options;

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (maxAge !== undefined) {
    parts.push(`Max-Age=${maxAge}`);
    const expires = new Date(Date.now() + maxAge * 1000);
    parts.push(`Expires=${expires.toUTCString()}`);
  }

  if (path) parts.push(`Path=${path}`);
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  if (sameSite) parts.push(`SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`);

  return parts.join('; ');
}

/**
 * Parses all cookies from the incoming HTTP Request.
 */
export function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies: Record<string, string> = {};

  if (!cookieHeader) return cookies;

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [rawKey, ...valParts] = pair.trim().split('=');
    if (!rawKey) continue;
    const key = decodeURIComponent(rawKey.trim());
    const val = decodeURIComponent(valParts.join('=').trim());
    cookies[key] = val;
  }

  return cookies;
}

/**
 * Creates Set-Cookie response headers for both access and refresh tokens.
 */
export function createAuthCookies(tokens: { accessToken: string; refreshToken: string }): Headers {
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    serializeCookie(ACCESS_COOKIE_NAME, tokens.accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
    })
  );
  headers.append(
    'Set-Cookie',
    serializeCookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
    })
  );
  return headers;
}

/**
 * Creates Set-Cookie response headers that immediately invalidate and delete auth cookies.
 */
export function clearAuthCookies(): Headers {
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    serializeCookie(ACCESS_COOKIE_NAME, '', {
      maxAge: 0,
    })
  );
  headers.append(
    'Set-Cookie',
    serializeCookie(REFRESH_COOKIE_NAME, '', {
      maxAge: 0,
    })
  );
  return headers;
}

export interface GetAuthUserResult {
  user: AuthUserPayload;
  headers?: Headers;
}

/**
 * Resolves the currently authenticated user from incoming cookies.
 * Automatically attempts a silent refresh if the access token has expired but the refresh token is valid.
 */
export async function getAuthUser(request: Request): Promise<GetAuthUserResult | null> {
  const cookies = parseCookies(request);
  const accessToken = cookies[ACCESS_COOKIE_NAME];
  const refreshToken = cookies[REFRESH_COOKIE_NAME];

  // 1. Attempt quick verification with the access token
  if (accessToken) {
    const verified = await verifyAccessToken(accessToken);
    if (verified) {
      return { user: verified };
    }
  }

  // 2. If access token is absent or expired, attempt refresh
  if (!refreshToken) {
    return null;
  }

  const refreshPayload = await verifyRefreshToken(refreshToken);
  if (!refreshPayload) {
    return null;
  }

  // 3. Verify user in database to ensure account is active and not soft-deleted
  const [dbUser] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      fullName: userProfiles.fullName,
      avatarUrl: userProfiles.avatarUrl,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(
      and(
        eq(users.id, refreshPayload.userId),
        eq(users.isActive, true),
        isNull(users.deletedAt),
        isNull(userProfiles.deletedAt)
      )
    )
    .limit(1);

  if (!dbUser) {
    return null;
  }

  const userPayload: AuthUserPayload = {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    fullName: dbUser.fullName || dbUser.email,
    avatarUrl: dbUser.avatarUrl,
  };

  // 4. Mint new tokens and return them with response headers for automatic cookie refresh
  const newAccessToken = await signAccessToken(userPayload);
  const newRefreshToken = await signRefreshToken(userPayload.id);
  const headers = createAuthCookies({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  return { user: userPayload, headers };
}

/**
 * Route guard for loaders and actions.
 * Throws a redirect to `/auth/login` if the user is unauthenticated or lacks required role.
 */
export async function requireAuth(
  request: Request,
  allowedRoles?: UserRole[]
): Promise<GetAuthUserResult> {
  const authResult = await getAuthUser(request);

  if (!authResult) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`;
    throw redirect(loginUrl, { headers: clearAuthCookies() });
  }

  if (allowedRoles && !allowedRoles.includes(authResult.user.role)) {
    throw redirect('/dashboard');
  }

  return authResult;
}
