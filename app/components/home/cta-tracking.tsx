import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Search } from 'lucide-react';

interface CtaTrackingProps {
  onTrackTicket: (ticketId: string) => void;
}

export function CtaTracking({ onTrackTicket }: CtaTrackingProps) {
  const [ticketInput, setTicketInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = ticketInput.trim().toUpperCase();
    if (!cleanId) {
      setError('Masukkan nomor tiket terlebih dahulu untuk melacak status.');
      inputRef.current?.focus();
      return;
    }
    setError('');
    onTrackTicket(cleanId);
  };

  return (
    <section id="lacak-tiket" className="bg-darknavy-900 relative overflow-hidden py-20 text-white">
      {/* Subtle Glow Graphics */}
      <div
        className="bg-accent-500/20 pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="bg-accent-500/10 pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-accent-500 mb-2 block text-xs font-bold tracking-widest uppercase">
          TRANSPARANSI TIKET
        </span>
        <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
          Ingin Melacak Status Laporan Anda?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-xs text-slate-400 sm:text-sm">
          Masukkan Nomor Tiket pengaduan yang Anda dapatkan saat mengirimkan aspirasi untuk melihat
          progres penanganan.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-md space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              ref={inputRef}
              type="text"
              value={ticketInput}
              aria-label="Nomor Tiket Registrasi"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'cta-ticket-error' : undefined}
              onChange={(e) => {
                setTicketInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: ASP-2026-1001"
              className={`rounded-full bg-white/10 px-6 py-6 font-mono text-xs text-white uppercase placeholder:text-slate-400 ${
                error
                  ? 'border-rose-500 focus-visible:ring-rose-500'
                  : 'focus-visible:ring-accent-500 border-white/20'
              }`}
            />
            <Button
              type="submit"
              className="bg-accent-500 hover:bg-accent-600 flex items-center justify-center gap-2 rounded-full px-8 py-6 text-xs font-bold whitespace-nowrap text-white shadow-lg transition-all"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Cek Status</span>
            </Button>
          </div>
          {error ? (
            <p id="cta-ticket-error" className="text-2xs font-semibold text-rose-400">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
