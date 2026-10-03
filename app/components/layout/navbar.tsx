import { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router';

import { NAV_LINKS } from '@/constants/navigation';

import { ArrowRight, ChevronDown, Landmark, Megaphone, Menu, Search, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aspirationDropdownOpen, setAspirationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAspirationDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAspirationDropdownOpen(false);
      }
    };

    if (aspirationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aspirationDropdownOpen]);

  return (
    <header className="border-warm-300/60 bg-background/90 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
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

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center space-x-9 text-sm font-semibold text-slate-600 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-accent-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons with Dropdown */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <a
              href="/#lacak-tiket"
              className="text-darknavy-900 hover:bg-warm-200/60 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Lacak Tiket</span>
            </a>

            {/* Tulis Aspirasi Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAspirationDropdownOpen((prev) => !prev)}
                aria-expanded={aspirationDropdownOpen}
                aria-haspopup="true"
                className={`bg-darknavy-900 hover:bg-accent-500 hover:shadow-accent-500/20 flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 ${
                  aspirationDropdownOpen ? 'bg-accent-500 ring-accent-300 ring-2' : ''
                }`}
              >
                <span>Tulis Aspirasi</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    aspirationDropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Floating Dropdown Menu */}
              {aspirationDropdownOpen ? (
                <div className="border-warm-200 animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-3 w-96 rounded-3xl border bg-white p-3 shadow-2xl duration-150">
                  <div className="border-warm-100 flex items-center justify-between border-b px-3 pt-2 pb-1.5">
                    <span className="text-2xs font-extrabold tracking-wider text-slate-400 uppercase">
                      Pilih Jenis Aduan / Usulan
                    </span>
                    <span className="text-2xs bg-warm-200 text-darknavy-900 rounded-full px-2 py-0.5 font-bold">
                      Kab. Tapin
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {/* Option 1: Aduan Masyarakat */}
                    <Link
                      to="/aspiration?type=masyarakat"
                      onClick={() => setAspirationDropdownOpen(false)}
                      className="hover:border-accent-200 hover:bg-accent-50/70 group flex items-start gap-3.5 rounded-2xl border border-transparent p-3 transition-all"
                    >
                      <div className="bg-accent-100 text-accent-600 group-hover:bg-accent-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-colors group-hover:text-white">
                        <Megaphone className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-darknavy-900 group-hover:text-accent-600 text-xs font-extrabold transition-colors">
                            1. Aduan Masyarakat
                          </p>
                          <span className="text-2xs bg-warm-200 rounded px-1.5 py-0.5 font-semibold text-slate-600">
                            Komisi DPRD
                          </span>
                        </div>
                        <p className="text-2xs mt-1 leading-relaxed text-slate-500">
                          Laporan keluhan fasilitas umum, jalan rusak, sampah, dan pelayanan publik
                          untuk pengawasan Komisi DPRD Tapin.
                        </p>
                      </div>
                    </Link>

                    {/* Option 2: Aduan Penyampaian Aspirasi Dapil */}
                    <Link
                      to="/aspiration?type=dapil"
                      onClick={() => setAspirationDropdownOpen(false)}
                      className="group flex items-start gap-3.5 rounded-2xl border border-transparent p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/70"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-xs transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <Landmark className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-darknavy-900 text-xs font-extrabold transition-colors group-hover:text-emerald-700">
                            2. Aduan Penyampaian Aspirasi Dapil
                          </p>
                          <span className="text-2xs rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
                            DPRD
                          </span>
                        </div>
                        <p className="text-2xs mt-1 leading-relaxed text-slate-500">
                          Usulan pokok pikiran (Pokir) pembangunan daerah pemilihan ditujukan
                          langsung ke anggota DPRD Kabupaten Tapin.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="text-darknavy-900 hover:bg-warm-200 rounded-xl p-2 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen ? (
        <div className="border-warm-300 space-y-3 border-b bg-white px-6 pt-4 pb-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMobileMenu}
              className="text-darknavy-900 block py-2 text-sm font-semibold"
            >
              {link.label}
            </a>
          ))}
          <div className="border-warm-200 flex flex-col gap-2.5 border-t pt-4">
            <a
              href="/#lacak-tiket"
              onClick={closeMobileMenu}
              className="text-darknavy-900 bg-warm-100 flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Lacak Status Laporan</span>
            </a>

            {/* Mobile: Pilihan 1 Aduan Masyarakat */}
            <Link
              to="/aspiration?type=masyarakat"
              onClick={closeMobileMenu}
              className="border-accent-200 bg-accent-50/50 text-darknavy-900 flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-xs font-bold shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-accent-500 flex h-8 w-8 items-center justify-center rounded-xl text-white">
                  <Megaphone className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-darknavy-900 font-extrabold">1. Aduan Masyarakat</p>
                  <p className="text-2xs font-normal text-slate-500">
                    Keluhan publik & pengawasan DPRD
                  </p>
                </div>
              </div>
              <ArrowRight className="text-accent-500 h-4 w-4" />
            </Link>

            {/* Mobile: Pilihan 2 Aduan Penyampaian Aspirasi Dapil */}
            <Link
              to="/aspiration?type=dapil"
              onClick={closeMobileMenu}
              className="text-darknavy-900 flex w-full items-center justify-between gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs font-bold shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Landmark className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-darknavy-900 font-extrabold">2. Aspirasi Dapil DPRD</p>
                  <p className="text-2xs font-normal text-slate-500">
                    Usulan Pokir DPRD Kab. Tapin
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
