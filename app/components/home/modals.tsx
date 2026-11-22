import { useEffect } from 'react';

import { useFetcher } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { AlertCircle, Building2, LoaderCircle, MapPin, Route } from 'lucide-react';

interface TrackModalProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
}

interface TrackedTicketData {
  id: string;
  ticketNumber: string;
  type: 'dapil' | 'masyarakat';
  reporterName: string;
  title: string | null;
  description: string;
  kamusUsulan?: string | null;
  dapilId?: string | null;
  status: 'menunggu_verifikasi' | 'terverifikasi' | 'sedang_diproses' | 'selesai' | 'ditolak';
  adminNotes: string | null;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  alamatLokasi: string;
  createdAt: string;
  representative?: {
    id: string;
    fullName: string;
    party: string | null;
    position: string | null;
  } | null;
  agency?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; step: number }> = {
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    step: 1,
  },
  terverifikasi: {
    label: 'Terverifikasi',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    step: 2,
  },
  sedang_diproses: {
    label: 'Sedang Diproses',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    step: 3,
  },
  selesai: {
    label: 'Selesai Ditangani',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    step: 4,
  },
  ditolak: {
    label: 'Ditolak',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    step: 2,
  },
};

export function TrackModal({ isOpen, ticketId, onClose }: TrackModalProps) {
  const fetcher = useFetcher<{
    success: boolean;
    ticket?: TrackedTicketData;
    error?: string;
  }>();

  useEffect(() => {
    if (isOpen && ticketId) {
      fetcher.submit({ ticketNumber: ticketId }, { method: 'post' });
    }
  }, [isOpen, ticketId, fetcher]);

  const isLoading = fetcher.state === 'submitting';
  const ticket = fetcher.data?.ticket;
  const error = fetcher.data?.error;

  const statusConfig = ticket?.status
    ? STATUS_CONFIG[ticket.status] || STATUS_CONFIG.menunggu_verifikasi
    : STATUS_CONFIG.menunggu_verifikasi;

  const currentStep = statusConfig.step;
  const isRejected = ticket?.status === 'ditolak';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-0 sm:max-w-lg">
        <DialogHeader className="bg-darknavy-900 rounded-t-3xl p-5 text-white">
          <div className="flex items-center gap-2">
            <Route className="text-accent-500 h-4 w-4" aria-hidden="true" />
            <DialogTitle className="text-sm font-bold text-white">
              Status Penanganan Tiket
            </DialogTitle>
          </div>
          <DialogDescription className="text-2xs text-slate-400">
            Pelacakan progres real-time laporan pengaduan Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <LoaderCircle className="text-accent-500 mb-3 h-8 w-8 animate-spin" />
              <p className="text-xs font-semibold">Mencari data tiket {ticketId}...</p>
            </div>
          ) : ticket ? (
            <>
              {/* Summary Box */}
              <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-darknavy-900 font-mono text-base font-extrabold">
                      {ticket.ticketNumber}
                    </p>
                    <span className="text-2xs rounded-md bg-slate-200 px-1.5 py-0.5 font-bold text-slate-700 uppercase">
                      {ticket.type === 'dapil' ? 'Pokir Dapil' : 'Aduan Publik'}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-500">
                    Pelapor: <span className="font-semibold">{ticket.reporterName}</span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-2xs px-3 py-1 font-bold ${statusConfig.badgeClass}`}
                >
                  {statusConfig.label}
                </Badge>
              </div>

              {/* Content Overview */}
              <div className="bg-warm-50 border-warm-200 space-y-2 rounded-2xl border p-4 text-xs">
                <div>
                  <span className="text-2xs font-bold text-slate-400 uppercase">
                    Subjek Laporan
                  </span>
                  <p className="text-darknavy-900 font-bold">
                    {ticket.title || ticket.kamusUsulan || 'Laporan Pengaduan Warga'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <Building2 className="text-accent-500 mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      {ticket.type === 'dapil'
                        ? ticket.representative?.fullName || ticket.dapilId || 'DPRD Tapin'
                        : ticket.agency || 'DPRD Tapin'}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <MapPin className="text-accent-500 mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {ticket.kelurahan}, {ticket.kecamatan}
                    </span>
                  </div>
                </div>

                {ticket.adminNotes ? (
                  <div className="mt-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900">
                    <p className="text-2xs font-bold text-amber-700 uppercase">
                      Catatan Petugas / Dewan
                    </p>
                    <p className="mt-0.5 text-xs italic">{ticket.adminNotes}</p>
                  </div>
                ) : null}
              </div>

              {/* 4-Step Vertical Timeline */}
              <div className="border-warm-300 relative space-y-4 border-l-2 pl-4">
                {/* Step 1: Laporan Diterima */}
                <div className="relative">
                  <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  <p className="text-darknavy-900 text-xs font-bold">Laporan Diterima</p>
                  <p className="text-2xs text-slate-400">
                    {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WITA — Masuk ke sistem SI-WADAY
                  </p>
                </div>

                {/* Step 2: Verifikasi Admin */}
                <div className="relative">
                  <span
                    className={`absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white ${
                      isRejected
                        ? 'bg-rose-500'
                        : currentStep >= 2
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                    }`}
                  />
                  <p
                    className={`text-xs font-bold ${
                      isRejected
                        ? 'text-rose-600'
                        : currentStep >= 2
                          ? 'text-darknavy-900'
                          : 'text-slate-400'
                    }`}
                  >
                    {isRejected ? 'Laporan Ditolak' : 'Verifikasi Berkas & Identitas'}
                  </p>
                  <p className="text-2xs text-slate-400">
                    {isRejected
                      ? 'Laporan tidak memenuhi kriteria kelayakan formil'
                      : currentStep >= 2
                        ? 'Identitas dan lokasi terverifikasi keabsahannya'
                        : 'Menunggu peninjauan oleh verifikator'}
                  </p>
                </div>

                {/* Step 3: Tindak Lanjut Lapangan */}
                <div className={`relative ${currentStep < 3 ? 'opacity-40' : ''}`}>
                  <span
                    className={`absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white ${
                      currentStep >= 3 ? 'bg-indigo-500' : 'bg-slate-300'
                    }`}
                  />
                  <p className="text-xs font-bold text-slate-900">
                    Proses Lapangan &amp; Pembahasan Dewan
                  </p>
                  <p className="text-2xs text-slate-400">
                    {currentStep >= 3
                      ? 'Diteruskan ke instansi terkait / diagendakan pada Pokir'
                      : 'Menunggu tahapan penanganan lapangan'}
                  </p>
                </div>

                {/* Step 4: Penanganan Selesai */}
                <div className={`relative ${currentStep < 4 ? 'opacity-40' : ''}`}>
                  <span
                    className={`absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white ${
                      currentStep >= 4 ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <p className="text-xs font-bold text-slate-900">Penanganan Selesai</p>
                  <p className="text-2xs text-slate-400">
                    {currentStep >= 4
                      ? 'Laporan telah berhasil ditindaklanjuti'
                      : 'Menunggu penyelesaian dan konfirmasi akhir'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h4 className="text-darknavy-900 text-sm font-extrabold">Tiket Tidak Ditemukan</h4>
              <p className="mt-1 text-xs text-slate-500">
                {error ||
                  `Kode tiket "${ticketId}" tidak terdaftar pada sistem SI-WADAY Kabupaten Tapin.`}
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left text-xs text-slate-500">
                <p className="font-bold text-slate-700">Contoh Kode Tiket yang Valid:</p>
                <ul className="text-2xs mt-1 list-disc space-y-0.5 pl-4">
                  <li>
                    <span className="font-mono font-bold">ASP-2026-1001</span> (Usulan Pokir Dapil
                    DPRD)
                  </li>
                  <li>
                    <span className="font-mono font-bold">ADU-2026-2001</span> (Aduan Pengawasan
                    Masyarakat)
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="pt-2 text-center">
            <Button
              type="button"
              onClick={onClose}
              className="bg-darknavy-900 hover:bg-darknavy-800 w-full rounded-full py-5 text-xs font-bold text-white transition-colors"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
