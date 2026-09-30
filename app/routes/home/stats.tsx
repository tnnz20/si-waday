import { Lock, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export function Stats() {
  return (
    <section id="tentang" className="border-warm-200 border-y bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Item 1: Active Citizen Community */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="border-accent-500 text-accent-500 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed font-bold">
                <Users className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div>
              <h4 className="text-darknavy-900 text-base font-bold">Komunitas Warga Aktif</h4>
              <p className="mt-0.5 text-xs text-slate-500">
                Wadah bersuara yang independen &amp; terpercaya.
              </p>
            </div>
          </div>

          {/* Item 2: SLA Response Analytics */}
          <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-3xl border p-6">
            <div>
              <div className="bg-accent-500/10 text-accent-500 mb-2 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              </div>
              <h4 className="text-darknavy-900 text-sm font-bold">Analitik Respon</h4>
              <p className="mt-0.5 text-xs text-slate-500">&lt; 24 Jam tindak lanjut cepat</p>
            </div>
            <span className="text-darknavy-900 text-2xl font-extrabold">24/7</span>
          </div>

          {/* Item 3: Guaranteed Privacy */}
          <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-3xl border p-6">
            <div>
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-600">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <h4 className="text-darknavy-900 text-sm font-bold">Privasi Terjamin</h4>
              <p className="mt-0.5 text-xs text-slate-500">Fitur laporan anonim 100% aman</p>
            </div>
            <span className="text-accent-500 text-2xl font-extrabold">
              <Lock className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
