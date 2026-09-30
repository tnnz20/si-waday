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
    <section id="keunggulan" className="bg-[#FAF5F0] py-24">
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
          <div className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Aman &amp; Terverifikasi</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Data dan laporan masyarakat dilindungi enkripsi. Pilihan mode anonim membuat Anda
              leluasa bersuara.
            </p>
          </div>

          {/* Card 2: Featured Focal Card in Full Coral */}
          <div className="bg-accent-500 coral-glow flex flex-col justify-between rounded-3xl p-8 text-white transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Tanpa Biaya Tambahan</h3>
              <p className="text-xs leading-relaxed text-white/90">
                Seluruh fasilitas portal SuaraWarga dapat diakses 100% gratis oleh seluruh lapisan
                masyarakat kapan saja.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-6 text-xs font-bold">
              <span>Layanan Publik Gratis</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>

          {/* Card 3: Universal Access */}
          <div className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <Smartphone className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Akses Di Mana Saja</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Dapat diakses dengan lancar lewat smartphone, tablet, maupun laptop tanpa perlu
              mengunduh aplikasi berat.
            </p>
          </div>

          {/* Card 4: Real-time Progress Tracking */}
          <div className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <Gauge className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Pantau Progres Real-Time</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Lacak setiap tahapan penanganan laporan Anda langsung dari nomor tiket khusus hingga
              selesai.
            </p>
          </div>

          {/* Card 5: Direct to Public Agencies */}
          <div className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Langsung ke Instansi</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Pengaduan diteruskan secara otomatis ke dinas berwenang seperti Dinas PUPR, Dishub,
              atau Dinkes.
            </p>
          </div>

          {/* Card 6: Community Endorsement */}
          <div className="soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent-50 text-accent-500 mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-darknavy-900 mb-2 text-lg font-bold">Dukungan Warga</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Sesama warga dapat berinteraksi, memberikan dukungan upvote, serta memperkuat urgensi
              keluhan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
