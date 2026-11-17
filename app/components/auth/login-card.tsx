import * as React from 'react';

import { Form } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';

import { Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';

export interface LoginCardProps {
  redirectTo: string;
  error?: string;
  isSubmitting?: boolean;
}

export function LoginCard({ redirectTo, error, isSubmitting = false }: LoginCardProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
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
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {/* Error Notification Banner */}
          {error ? (
            <div className="animate-in fade-in flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200 text-red-800">
                !
              </span>
              <span>{error}</span>
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
  );
}
