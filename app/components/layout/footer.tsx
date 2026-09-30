import { FOOTER_NAV_LINKS, MITRA_AGENCIES } from '@/constants/navigation';

import { Megaphone, PhoneCall } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-darknavy-900 border-darknavy-800 border-t py-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-darknavy-800 grid grid-cols-1 gap-10 border-b pb-12 md:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-accent-500 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white">
                <Megaphone className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-white">Si Waday</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Platform independen aspirasi &amp; pengaduan publik untuk mewujudkan kota yang
              transparan, responsif, dan inklusif.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">Navigasi</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Partner Agencies */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Instansi Mitra
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {MITRA_AGENCIES.map((agency) => (
                <li key={agency.name}>
                  <a href={agency.href} className="transition-colors hover:text-white">
                    {agency.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Emergency Hotline */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Layanan Darurat
            </h4>
            <p className="mb-3 text-xs text-slate-400">
              Untuk keadaan darurat bencana atau membahayakan nyawa:
            </p>
            <div className="bg-darknavy-800 text-accent-500 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold">
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Call Center 112</span>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Si Waday Indonesia. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="/#beranda" className="transition-colors hover:text-slate-300">
              Kebijakan Privasi
            </a>
            <a href="/#beranda" className="transition-colors hover:text-slate-300">
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
