import { useState } from 'react';

import { ArrowRight, Megaphone, Menu, PenLine, Search, X } from 'lucide-react';

interface NavbarProps {
  onOpenAspirationModal: () => void;
  onOpenTrackModal: (ticketId?: string) => void;
}

export function Navbar({ onOpenAspirationModal, onOpenTrackModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-warm-300/60 bg-warm-100/90 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <a href="#beranda" className="group flex items-center gap-3">
            <div className="bg-accent-500 shadow-accent-500/20 flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-105">
              <Megaphone className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-darknavy-900 flex items-center gap-1 text-xl font-extrabold tracking-tight">
                Suara<span className="text-accent-500">Warga</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center space-x-9 text-sm font-semibold text-slate-600 md:flex">
            <a href="#beranda" className="hover:text-accent-500 transition-colors">
              Beranda
            </a>
            <a href="#tentang" className="hover:text-accent-500 transition-colors">
              Alur Aspirasi
            </a>
            <a href="#keunggulan" className="hover:text-accent-500 transition-colors">
              Keunggulan
            </a>
            <a href="#aspirasi" className="hover:text-accent-500 transition-colors">
              Aspirasi Terkini
            </a>
            <a href="#faq" className="hover:text-accent-500 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => onOpenTrackModal()}
              className="text-darknavy-900 hover:bg-warm-200/60 flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Lacak Tiket</span>
            </button>
            <button
              type="button"
              onClick={onOpenAspirationModal}
              className="bg-darknavy-900 hover:bg-accent-500 hover:shadow-accent-500/20 flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300"
            >
              <span>Tulis Aspirasi</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
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
          <a
            href="#beranda"
            onClick={closeMobileMenu}
            className="text-darknavy-900 block py-2 text-sm font-semibold"
          >
            Beranda
          </a>
          <a
            href="#tentang"
            onClick={closeMobileMenu}
            className="text-darknavy-900 block py-2 text-sm font-semibold"
          >
            Alur Aspirasi
          </a>
          <a
            href="#keunggulan"
            onClick={closeMobileMenu}
            className="text-darknavy-900 block py-2 text-sm font-semibold"
          >
            Keunggulan
          </a>
          <a
            href="#aspirasi"
            onClick={closeMobileMenu}
            className="text-darknavy-900 block py-2 text-sm font-semibold"
          >
            Aspirasi Terkini
          </a>
          <a
            href="#faq"
            onClick={closeMobileMenu}
            className="text-darknavy-900 block py-2 text-sm font-semibold"
          >
            FAQ
          </a>
          <div className="border-warm-200 flex flex-col gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onOpenTrackModal();
              }}
              className="text-darknavy-900 bg-warm-100 flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Lacak Status Laporan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onOpenAspirationModal();
              }}
              className="bg-accent-500 flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold text-white shadow-md"
            >
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tulis Aspirasi</span>
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
