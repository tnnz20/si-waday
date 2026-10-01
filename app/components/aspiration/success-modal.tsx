import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { AspirationType } from '@/types/aspiration';

import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCheck2,
  Home,
  Landmark,
  MapPin,
} from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  aspirationType: AspirationType;
  author: string;
  targetDestination: string;
  summaryTitle: string;
  kecamatan: string;
  kelurahan: string;
  satisfactionRating?: number;
  onTrackTicket: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  ticketId,
  aspirationType,
  author,
  targetDestination,
  summaryTitle,
  kecamatan,
  kelurahan,
  satisfactionRating,
  onTrackTicket,
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDapil = aspirationType === 'dapil';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 max-w-lg overflow-hidden rounded-3xl border bg-white p-0 shadow-2xl">
        {/* Obsidian Header with Coral/Emerald Accent */}
        <DialogHeader className="bg-darknavy-900 relative overflow-hidden p-6 text-left text-white sm:p-8">
          <div className="bg-accent-500/10 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl" />

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-2xs rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 font-extrabold tracking-wider text-emerald-400 uppercase">
                Berhasil Dicatat
              </span>
              <DialogTitle className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                {isDapil ? 'Aspirasi Dapil DPRD Terkirim!' : 'Aduan Masyarakat Terkirim!'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300">
                {isDapil
                  ? 'Usulan Anda telah berhasil diregistrasi ke Pokir DPRD Kabupaten Tapin.'
                  : 'Laporan keluhan Anda telah berhasil dicatat untuk ditindaklanjuti dan diawasi oleh DPRD Kabupaten Tapin.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body Receipt Details */}
        <div className="space-y-5 p-6 sm:p-8">
          {/* Ticket ID Highlight Box */}
          <div className="border-warm-300 bg-warm-50 flex items-center justify-between rounded-2xl border p-4">
            <div>
              <span className="text-2xs block font-bold tracking-wider text-slate-500 uppercase">
                Nomor Tiket Registrasi Resmi:
              </span>
              <span className="text-darknavy-900 font-mono text-lg font-extrabold tracking-wider sm:text-xl">
                {ticketId}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-warm-300 text-darknavy-900 hover:bg-warm-100 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Salin ID</span>
                </>
              )}
            </Button>
          </div>

          {/* Civic Summary Grid */}
          <div className="border-warm-200 divide-warm-200 divide-y overflow-hidden rounded-2xl border bg-white text-xs">
            <div className="bg-warm-50/50 flex items-center justify-between p-3">
              <span className="font-medium text-slate-500">Pengusul / Pelapor</span>
              <span className="text-darknavy-900 font-bold">{author}</span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="font-medium text-slate-500">
                {isDapil ? 'Tujuan Dapil DPRD' : 'Tujuan Komisi / Bidang DPRD'}
              </span>
              <span className="text-accent-600 bg-accent-50 text-2xs flex items-center gap-1 rounded-full px-2 py-0.5 font-bold">
                {isDapil ? <Landmark className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                <span>{targetDestination}</span>
              </span>
            </div>

            <div className="bg-warm-50/50 flex items-center justify-between p-3">
              <span className="font-medium text-slate-500">
                {isDapil ? 'Kamus Usulan' : 'Perihal Laporan'}
              </span>
              <span className="text-darknavy-900 max-w-xs truncate text-right font-bold">
                {summaryTitle}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="font-medium text-slate-500">Lokasi Terkait</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin className="text-accent-500 h-3.5 w-3.5" />
                <span>
                  {kelurahan ? `${kelurahan}, ` : ''}Kec. {kecamatan}, Tapin
                </span>
              </span>
            </div>

            <div className="bg-warm-50/50 flex items-center justify-between p-3">
              <span className="font-medium text-slate-500">Status Awal</span>
              <span className="text-2xs rounded-full bg-amber-100 px-2.5 py-0.5 font-extrabold text-amber-800">
                Dalam Proses (Verifikasi Admin)
              </span>
            </div>

            {satisfactionRating ? (
              <div className="flex items-center justify-between p-3">
                <span className="font-medium text-slate-500">Ulasan Aplikasi</span>
                <span className="text-accent-600 bg-accent-50 text-2xs flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold">
                  ★ {satisfactionRating}/5 Bintang Terkirim
                </span>
              </div>
            ) : null}
          </div>

          <div className="border-warm-200 bg-warm-50 text-2xs flex items-start gap-2.5 rounded-xl border p-3 leading-relaxed text-slate-600">
            <FileCheck2 className="text-accent-500 mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Simpan Nomor Tiket di atas untuk memantau kemajuan tindak lanjut di fitur{' '}
              <strong>Lacak Tiket</strong> pada beranda Si Waday.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="bg-warm-100/80 border-warm-200 flex flex-col items-center gap-2 border-t p-4 sm:flex-row sm:p-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-warm-300 text-darknavy-900 hover:bg-warm-200 w-full rounded-full bg-white text-xs font-bold sm:w-auto"
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Button>

          <Button
            type="button"
            onClick={onTrackTicket}
            className="coral-glow bg-accent-500 hover:bg-accent-600 w-full rounded-full text-xs font-bold text-white shadow-md sm:w-auto"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            <span>Lacak Status Tiket Sekarang</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
