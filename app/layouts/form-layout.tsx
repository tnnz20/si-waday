import { Link, Outlet } from 'react-router';

import { Toaster } from '@/components/ui/sonner';

import { Megaphone, ShieldCheck } from 'lucide-react';

export default function FormLayout() {
  return (
    <div className="bg-background text-foreground selection:bg-accent-500 flex min-h-dvh flex-col overflow-x-hidden selection:text-white">
      {/* Top Header: Focused & Distraction-Free Form Header */}
      <header className="border-warm-200 sticky top-0 z-30 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="bg-accent-500 shadow-accent-500/20 flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs transition-transform group-hover:scale-105">
              <Megaphone className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-darknavy-900 text-sm font-extrabold tracking-tight">
                  <span>Si</span>
                  <span className="text-accent-500">Waday</span>
                </span>
                <span className="bg-warm-100 text-darknavy-800 text-2xs rounded-full px-2 py-0.5 font-bold">
                  Kab. Tapin
                </span>
              </div>
              <p className="text-2xs text-slate-400">Portal Aspirasi &amp; Pengaduan Warga</p>
            </div>
          </Link>

          {/* Right Trust Badge */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="text-2xs font-semibold">Layanan Resmi &amp; Terenkripsi</span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Compact Focused Footer */}
      <footer className="border-warm-200 border-t bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 Pemerintah &amp; DPRD Kabupaten Tapin. Hak Cipta Dilindungi.</p>
        </div>
      </footer>

      {/* Persistent Toast Notifications */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
