import { useState } from 'react';

import { Link } from 'react-router';

import { NAV_LINKS } from '@/constants/navigation';

import { ArrowRight, Megaphone, Menu, PenLine, Search, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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

          {/* Desktop Action Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="/#lacak-tiket"
              className="text-darknavy-900 hover:bg-warm-200/60 flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Lacak Tiket</span>
            </a>
            <Link
              to="/aspiration"
              className="bg-darknavy-900 hover:bg-accent-500 hover:shadow-accent-500/20 flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300"
            >
              <span>Tulis Aspirasi</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
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
          <div className="border-warm-200 flex flex-col gap-2 border-t pt-4">
            <a
              href="/#lacak-tiket"
              onClick={closeMobileMenu}
              className="text-darknavy-900 bg-warm-100 flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Lacak Status Laporan</span>
            </a>
            <Link
              to="/aspiration"
              onClick={closeMobileMenu}
              className="bg-accent-500 flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold text-white shadow-md"
            >
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tulis Aspirasi</span>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
