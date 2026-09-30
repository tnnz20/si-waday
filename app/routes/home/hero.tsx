import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Megaphone,
  MessageSquare,
  PlayCircle,
} from 'lucide-react';

interface HeroProps {
  onOpenAspirationModal: () => void;
}

export function Hero({ onOpenAspirationModal }: HeroProps) {
  return (
    <section id="beranda" className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative spark */}
        <div
          className="text-accent-500 pointer-events-none absolute top-2 left-4 hidden opacity-60 sm:block"
          aria-hidden="true"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Hero Left Column */}
          <div className="space-y-7 text-center lg:col-span-6 lg:text-left">
            {/* Top Eyebrow Badge */}
            <div className="bg-accent-50 border-accent-100 text-accent-600 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide">
              <span className="bg-accent-500 h-2 w-2 animate-ping rounded-full" />
              <span>Platform Komunitas &amp; Suara Publik</span>
            </div>

            {/* Headline */}
            <h1 className="text-darknavy-900 text-4xl leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Lakukan segalanya yang kamu bisa demi{' '}
              <span className="text-accent-500 decoration-accent-500/30 underline underline-offset-8">
                kemajuan kota.
              </span>
            </h1>

            {/* Subtitle description */}
            <p className="mx-auto max-w-xl text-base leading-relaxed font-normal text-slate-600 sm:text-lg lg:mx-0">
              SuaraWarga menghubungkan gagasan, keluhan infrastruktur, dan apresiasi pelayanan
              publik secara langsung dengan pihak berwenang secara transparan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={onOpenAspirationModal}
                className="bg-accent-500 hover:bg-accent-600 coral-glow group flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white transition-all duration-300 sm:w-auto"
              >
                <span>Sampaikan Aspirasi</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
              <a
                href="#tentang"
                className="border-warm-300 text-darknavy-900 hover:bg-warm-100 flex w-full items-center justify-center gap-2 rounded-full border bg-white px-7 py-4 text-sm font-bold transition-all sm:w-auto"
              >
                <PlayCircle className="text-accent-500 h-4 w-4" aria-hidden="true" />
                <span>Cara Kerja</span>
              </a>
            </div>

            {/* Proof Citizen Avatars */}
            <div className="flex items-center justify-center gap-4 pt-6 text-xs text-slate-500 lg:justify-start">
              <div className="flex -space-x-2">
                <img
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Citizen avatar"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Citizen avatar"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Citizen avatar"
                />
              </div>
              <p className="font-medium">
                <strong className="text-darknavy-900 font-bold">14.800+</strong> warga telah
                berpartisipasi
              </p>
            </div>
          </div>

          {/* Hero Right Column (Interactive Orbital Node Cluster) */}
          <div className="relative flex items-center justify-center lg:col-span-6">
            <div className="relative flex aspect-square w-full max-w-lg items-center justify-center">
              {/* Background Dashed Orbits */}
              <div
                className="border-warm-300/80 spin-slow pointer-events-none absolute inset-4 rounded-full border-2 border-dashed"
                aria-hidden="true"
              />
              <div
                className="border-warm-300/60 pointer-events-none absolute inset-16 rounded-full border"
                aria-hidden="true"
              />

              {/* Central Core Node */}
              <div className="bg-accent-500 shadow-accent-500/40 relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full p-2 text-center text-xs font-extrabold text-white shadow-2xl">
                <Megaphone className="mb-1 h-7 w-7" aria-hidden="true" />
                <span>SuaraWarga</span>
              </div>

              {/* Orbiting Satellite Node 1: Citizen Complaint */}
              <div className="border-warm-200 animate-bounce-slow absolute top-4 left-16 flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-lg">
                <img
                  className="h-9 w-9 rounded-xl object-cover"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                  alt="Budi S."
                />
                <div className="pr-2 text-[11px]">
                  <p className="text-darknavy-900 leading-none font-bold">Budi S.</p>
                  <span className="text-accent-500 text-[9px] font-semibold">Perbaikan Jalan</span>
                </div>
              </div>

              {/* Orbiting Satellite Node 2: Verification */}
              <div className="border-warm-200 animate-float-delayed absolute top-12 right-6 flex items-center gap-2 rounded-2xl border bg-white p-2.5 shadow-lg">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Rina K."
                />
                <div className="pr-1 text-[11px]">
                  <p className="text-darknavy-900 leading-none font-bold">Rina K.</p>
                  <span className="text-[9px] text-slate-400">Terverifikasi</span>
                </div>
              </div>

              {/* Orbiting Satellite Node 3: Progress Card */}
              <div className="border-warm-200 animate-float absolute bottom-12 left-6 max-w-[160px] rounded-2xl border bg-white p-3 text-left shadow-xl">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                  Progres
                </span>
                <p className="text-darknavy-900 mt-1 line-clamp-1 text-xs font-bold">
                  Penerangan Jalan
                </p>
                <p className="text-[10px] text-slate-400">Dinas PUPR</p>
              </div>

              {/* Floating Stat Card Badge */}
              <div className="bg-darknavy-900 absolute right-8 bottom-6 max-w-[200px] rounded-3xl p-4 text-white shadow-2xl">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-accent-500 text-[10px] font-bold tracking-wider uppercase">
                    Status Laporan
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                </div>
                <p className="text-xl font-extrabold">98.4%</p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Laporan terselesaikan dengan baik bulan ini.
                </p>
              </div>

              {/* Micro Floating Reaction Bubbles */}
              <div className="animate-float-delayed pointer-events-none absolute top-[44%] left-0">
                <div className="border-warm-200 text-accent-500 flex h-10 w-10 items-center justify-center rounded-full border bg-white font-bold shadow-md">
                  <Heart className="fill-accent-500 h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <div className="animate-float pointer-events-none absolute top-[32%] right-2">
                <div className="border-warm-200 flex h-9 w-9 items-center justify-center rounded-full border bg-white font-bold text-blue-500 shadow-md">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
