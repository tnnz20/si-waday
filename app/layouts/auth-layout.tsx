import { Link, Outlet } from 'react-router';

import { Toaster } from '@/components/ui/sonner';

import { ArrowLeft, Layers } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="bg-warm-100 text-darknavy-900 selection:bg-accent-500 relative flex min-h-dvh flex-col justify-between font-sans antialiased selection:text-white">
      {/* Top Navigation Bar: Back to Home & Brand */}
      <header className="relative z-10 flex w-full items-center justify-between p-4 sm:px-8 sm:py-6">
        <Link
          to="/"
          className="border-warm-200 text-darknavy-900 inline-flex items-center gap-2 rounded-xl border bg-white/80 px-3.5 py-2 text-xs font-bold shadow-xs backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-white sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-emerald-600" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-accent-500 shadow-accent-500/25 flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm transition-transform hover:scale-105">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-darknavy-900 font-extrabold tracking-tight sm:text-base">
            SI-WADAY
          </span>
        </Link>
      </header>

      {/* Main Outlet Container */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6">
        <Outlet />
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Pemerintah & DPRD Kabupaten Tapin. Hak Cipta Dilindungi.</p>
      </footer>

      {/* Persistent Sonner Toast Container */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
