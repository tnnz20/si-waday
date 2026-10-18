import * as React from 'react';

import { and, eq, isNull, or } from 'drizzle-orm';
import { Form, redirect, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { db } from '~/db/index.server';
import { userProfiles, users } from '~/db/schema/schema';
import {
  type AuthUserPayload,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
} from '~/lib/auth.server';
import { createAuthCookies, getAuthUser } from '~/lib/session.server';

import { Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';

import type { Route } from './+types/login';

export const meta: Route.MetaFunction = () => [
  { title: 'Masuk • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Pusat Kendali Terpadu Aduan Pelayanan Publik dan Pokok Pikiran DPRD Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await getAuthUser(request);
  if (authResult) {
    return redirect('/dashboard');
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
  return { redirectTo };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const identifier = String(formData.get('identifier') || formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const rawRedirectTo = String(formData.get('redirectTo') || '/dashboard');
  const redirectTo =
    rawRedirectTo.startsWith('/') && !rawRedirectTo.startsWith('//') ? rawRedirectTo : '/dashboard';

  if (!identifier || !password) {
    return { error: 'Email atau username dan kata sandi wajib diisi.' };
  }

  // Find user and profile matching email or slug (case-insensitive)
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      role: users.role,
      isActive: users.isActive,
      deletedAt: users.deletedAt,
      fullName: userProfiles.fullName,
      avatarUrl: userProfiles.avatarUrl,
      regionId: userProfiles.regionId,
      slug: userProfiles.slug,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(
      and(
        or(
          eq(users.email, identifier.toLowerCase()),
          eq(userProfiles.slug, identifier.toLowerCase())
        ),
        isNull(users.deletedAt)
      )
    )
    .limit(1);

  if (!user) {
    return { error: 'Email/username atau kata sandi tidak sesuai.' };
  }

  if (!user.isActive) {
    return { error: 'Akun Anda telah dinonaktifkan. Hubungi administrator.' };
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: 'Email/username atau kata sandi tidak sesuai.' };
  }

  // Update lastLoginAt
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

  // Mint access and refresh tokens
  const payload: AuthUserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName || user.email,
    avatarUrl: user.avatarUrl,
    regionId: user.regionId,
  };

  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(user.id);

  const headers = createAuthCookies({ accessToken, refreshToken });
  return redirect(redirectTo, { headers });
}

export default function LoginPage({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="animate-in fade-in-50 zoom-in-95 w-full max-w-md duration-200">
      <Card className="border-warm-200 rounded-3xl bg-white/95 p-2 shadow-xl backdrop-blur-md sm:p-4">
        <CardHeader className="space-y-2 pb-4 text-center sm:text-center">
          <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-darknavy-900 text-xl font-black tracking-tight sm:text-2xl">
            Masuk ke Sistem
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 sm:text-sm">
            Portal otorisasi pengelolaan aspirasi & aduan warga Kabupaten Tapin
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="redirectTo" value={loaderData.redirectTo} />

            {/* Error Notification Banner */}
            {actionData?.error ? (
              <div className="animate-in fade-in flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200 text-red-800">
                  !
                </span>
                <span>{actionData.error}</span>
              </div>
            ) : null}

            {/* Identifier Field (Email or Username) */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="identifier"
                className="text-darknavy-900 block text-xs font-bold tracking-wide uppercase"
              >
                Email atau Username
              </label>
              <div className="relative">
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="admin atau nama@siwaday.tapinkab.go.id"
                  className="border-warm-200 bg-warm-50 h-11 text-sm transition-all focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-darknavy-900 block text-xs font-bold tracking-wide uppercase"
                >
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border-warm-200 bg-warm-50 h-11 pr-10 text-sm transition-all focus-visible:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="hover:text-darknavy-900 absolute top-1/2 right-3 -translate-y-1/2 p-1 text-slate-400 transition-colors"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-emerald-600 font-extrabold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </Button>
          </Form>

          {/* Security Notice */}
          <div className="border-warm-200 bg-warm-50/70 text-2xs mt-6 flex items-start gap-2.5 rounded-xl border p-3 text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <p>
              Akses terbatas untuk Administrator & Anggota Dewan yang terdaftar di Pemerintah Kab.
              Tapin. Semua aktivitas sesi dipantau dan diaudit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
