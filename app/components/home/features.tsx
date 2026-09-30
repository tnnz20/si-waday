import { Card } from '@/components/ui/card';

import {
  ArrowRight,
  Building2,
  Gauge,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';

export function Features() {
  return (
    <section id="keunggulan" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-accent-500 mb-2 block text-xs font-bold tracking-widest uppercase">
            MENGAPA PILIH KAMI
          </span>
          <h2 className="text-darknavy-900 text-3xl font-extrabold sm:text-4xl">
            Satu wadah sosial untuk perubahan kota
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Melalui platform digital interaktif, keluhan dan ide dari masyarakat disalurkan dengan
            transparan tanpa birokrasi rumit.
          </p>
        </div>

        {/* Asymmetric 3x2 Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Safe & Verified */}
          <Card className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Aman &amp; Terverifikasi</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Data dan laporan masyarakat dilindungi enkripsi. Pilihan mode anonim membuat Anda
              leluasa bersuara.
            </p>
          </Card>

          {/* Card 2: Featured Focal Card in Full Coral */}
          <Card className="bg-accent-500 coral-glow flex flex-col justify-between rounded-3xl border-none p-8 text-white transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Tanpa Biaya Tambahan</h3>
              <p className="text-xs leading-relaxed text-white/90">
                Seluruh fasilitas portal Si Waday dapat diakses 100% gratis oleh seluruh lapisan
                masyarakat kapan saja.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-6 text-xs font-bold">
              <span>Layanan Publik Gratis</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </Card>

          {/* Card 3: Realtime Notifications */}
          <Card className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <Smartphone className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Notifikasi Real-time</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Dapatkan pembaruan langsung via nomor tiket saat laporan Anda ditanggapi oleh dinas
              terkait.
            </p>
          </Card>

          {/* Card 4: Quick Action */}
          <Card className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <Gauge className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Tindak Lanjut Cepat</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Sistem eskalasi otomatis memastikan aduan Anda diterima dinas yang berwenang dalam
              waktu singkat.
            </p>
          </Card>

          {/* Card 5: Public Discussion */}
          <Card className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Diskusi Komunitas</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Warga lain dapat memberikan dukungan suara dan komentar solutif agar masalah cepat
              diprioritaskan.
            </p>
          </Card>

          {/* Card 6: Connected City Offices */}
          <Card className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Terhubung ke Dinas</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Terintegrasi langsung dengan puluhan dinas pemkot/pemkab untuk penanganan langsung di
              lapangan.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
