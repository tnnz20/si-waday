import { Link, Outlet } from 'react-router';

import { Toaster } from '@/components/ui/sonner';

import { ArrowLeft, Megaphone } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="bg-warm-100 text-darknavy-900 selection:bg-accent-500 relative flex min-h-dvh flex-col justify-between font-sans antialiased selection:text-white">
      {/* Top Navigation Bar: Back to Home & Brand */}
      <header className="relative z-10 flex w-full items-center justify-between p-4 sm:px-8 sm:py-6">
        <Link
          to="/"
          className="border-warm-200 text-darknavy-900 hover:border-accent-500 inline-flex items-center gap-2 rounded-xl border bg-white/80 px-3.5 py-2 text-xs font-bold shadow-xs backdrop-blur-sm transition-all hover:bg-white sm:text-sm"
        >
          <ArrowLeft className="text-darknavy-900 h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Brand Logo matching homepage */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="bg-accent-500 shadow-accent-500/20 flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-105">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-darknavy-900 flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
              <span>Si</span>
              <span className="text-accent-500">Waday</span>
            </span>
          </div>
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
