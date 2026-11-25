import * as React from 'react';

import { Link } from 'react-router';
import { toast } from 'sonner';
import { getPublicTicketWithFeedback } from '~/lib/ticket.server';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { APP_NAME } from '@/constants/index';

import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCheck2,
  Home,
  Landmark,
  MapPin,
  PlusCircle,
  Printer,
  Star,
} from 'lucide-react';

import type { Route } from './+types/success';

export const meta: Route.MetaFunction = ({ params }) => {
  const ticketNumber = params.ticketNumber || '';
  return [
    { title: `Bukti Registrasi Tiket ${ticketNumber} • ${APP_NAME}` },
    {
      name: 'description',
      content:
        'Tanda bukti registrasi resmi pengajuan aspirasi dan aduan warga Kabupaten Tapin melalui SI-WADAY.',
    },
  ];
};

export async function loader({ params }: Route.LoaderArgs) {
  const ticketNumber = params.ticketNumber;
  if (!ticketNumber) {
    return { ticket: null, feedback: null, ticketNumber: '' };
  }

  const result = await getPublicTicketWithFeedback(ticketNumber);
  if (!result) {
    return { ticket: null, feedback: null, ticketNumber };
  }

  return {
    ticket: result.ticket,
    feedback: result.feedback,
    ticketNumber,
  };
}

export default function SuccessPage({ loaderData }: Route.ComponentProps) {
  const { ticket, feedback, ticketNumber } = loaderData;
  const [copied, setCopied] = React.useState(false);

  const handleCopyTicket = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      toast.success('Nomor Tiket Disalin', {
        description: `${ticketNumber} berhasil disalin ke papan klip.`,
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!ticket) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="border-warm-200 bg-warm-50 flex h-16 w-16 items-center justify-center rounded-2xl border text-slate-400 shadow-sm">
          <FileCheck2 className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-darknavy-900 mt-4 text-2xl font-black tracking-tight">
          Tiket Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Nomor registrasi <span className="font-mono font-bold">{ticketNumber}</span> tidak
          terdaftar pada sistem SI-WADAY Kabupaten Tapin.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" className="border-warm-300 rounded-full">
            <Link to="/">
              <Home className="mr-1.5 h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
          <Button asChild className="bg-accent-500 hover:bg-accent-600 rounded-full text-white">
            <Link to="/#lacak-tiket">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              <span>Lacak Tiket Lain</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isDapil = ticket.type === 'dapil';
  const maskedNik = ticket.maskedNik;

  const targetDestination = isDapil
    ? ticket.representative?.fullName || ticket.dapilId || 'DPRD Kabupaten Tapin'
    : ticket.agency || 'DPRD Kabupaten Tapin';

  const summarySubject =
    ticket.title || ticket.kamusUsulan || (isDapil ? 'Usulan Pokir Dapil' : 'Aduan Masyarakat');

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Top back navigation (Hidden on Print) */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          to="/"
          className="text-accent-600 hover:text-accent-700 inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-warm-300 text-darknavy-900 hover:bg-warm-100 rounded-full bg-white text-xs font-bold shadow-xs"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            <span>Cetak / Simpan PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Official Receipt Card */}
      <Card className="border-warm-200 overflow-hidden rounded-3xl border bg-white shadow-xl print:border-none print:shadow-none">
        {/* Obsidian Header with Celebration Accent */}
        <div className="bg-darknavy-900 relative overflow-hidden p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-emerald-400/40 bg-emerald-400/20 px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-emerald-300 uppercase"
                  >
                    Tercatat Resmi
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-300">
                    {isDapil ? 'Pokir Dapil DPRD' : 'Aduan Pengawasan'}
                  </span>
                </div>
                <h1 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                  {isDapil ? 'Aspirasi Dapil Terkirim!' : 'Aduan Masyarakat Terkirim!'}
                </h1>
                <p className="text-xs text-slate-300">
                  Laporan Anda telah berhasil diregistrasi ke sistem pengawasan DPRD Kabupaten
                  Tapin.
                </p>
              </div>
            </div>

            {/* Print Brand Stamp */}
            <div className="hidden text-right text-xs text-slate-400 sm:block">
              <p className="font-mono font-bold text-white uppercase">{APP_NAME}</p>
              <p className="text-2xs">Kabupaten Tapin</p>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 p-6 sm:p-8">
          {/* Ticket ID Highlight Callout */}
          <div className="border-warm-300 bg-warm-50 flex flex-col items-start justify-between gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-5">
            <div>
              <span className="text-2xs block font-bold tracking-wider text-slate-500 uppercase">
                Nomor Tiket Registrasi Resmi:
              </span>
              <span className="text-darknavy-900 font-mono text-xl font-black tracking-wider sm:text-2xl">
                {ticketNumber}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyTicket}
              className="border-warm-300 text-darknavy-900 hover:bg-warm-100 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-xs print:hidden"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 stroke-[2.5] text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Salin Nomor Tiket</span>
                </>
              )}
            </Button>
          </div>

          {/* Civic Details Grid Table */}
          <div className="border-warm-200 divide-warm-200 divide-y overflow-hidden rounded-2xl border bg-white text-xs sm:text-sm">
            <div className="bg-warm-50/50 flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
              <span className="font-medium text-slate-500">Waktu Pengajuan</span>
              <span className="text-darknavy-900 font-semibold">{formattedDate} WITA</span>
            </div>

            <div className="flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
              <span className="font-medium text-slate-500">Identitas Pelapor</span>
              <div className="text-darknavy-900 text-left sm:text-right">
                <span className="font-bold">{ticket.reporterName}</span>
                {maskedNik ? (
                  <span className="text-2xs block font-mono text-slate-400">NIK: {maskedNik}</span>
                ) : null}
              </div>
            </div>

            <div className="bg-warm-50/50 flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
              <span className="font-medium text-slate-500">
                {isDapil ? 'Dapil & Dewan Dituju' : 'Tujuan Komisi / Bidang DPRD'}
              </span>
              <span className="text-accent-600 bg-accent-50 text-2xs inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 font-bold sm:self-auto">
                {isDapil ? (
                  <Landmark className="h-3.5 w-3.5" />
                ) : (
                  <Building2 className="h-3.5 w-3.5" />
                )}
                <span>{targetDestination}</span>
              </span>
            </div>

            <div className="flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
              <span className="font-medium text-slate-500">
                {isDapil ? 'Kamus Usulan Pokir' : 'Subjek / Perihal Aduan'}
              </span>
              <span className="text-darknavy-900 max-w-md font-bold sm:text-right">
                {summarySubject}
              </span>
            </div>

            <div className="bg-warm-50/50 flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
              <span className="font-medium text-slate-500">Lokasi Masalah / Usulan</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <MapPin className="text-accent-500 h-3.5 w-3.5 shrink-0" />
                <span>
                  {ticket.kelurahan ? `Kel. ${ticket.kelurahan}, ` : ''}Kec. {ticket.kecamatan},
                  Tapin
                </span>
              </span>
            </div>

            <div className="flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
              <span className="font-medium text-slate-500">Status Tindak Lanjut</span>
              <Badge
                variant="outline"
                className="self-start border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 sm:self-auto"
              >
                Menunggu Verifikasi (1x24 Jam)
              </Badge>
            </div>

            {feedback ? (
              <div className="bg-warm-50/50 flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
                <span className="font-medium text-slate-500">Ulasan Kepuasan Aplikasi</span>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xs font-mono font-bold text-slate-600">
                    ({feedback.rating}/5 Bintang)
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Verification & SLA Guidance */}
          <div className="border-warm-200 bg-warm-50 text-2xs flex items-start gap-3 rounded-2xl border p-4 leading-relaxed text-slate-600 sm:text-xs">
            <FileCheck2 className="text-accent-500 mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-1">
              <p className="text-darknavy-900 font-bold">Langkah Selanjutnya:</p>
              <p>
                Petugas verifikator Sekretariat DPRD Kabupaten Tapin akan memverifikasi kelayakan
                formil identitas dan substansi laporan dalam waktu 1x24 jam kerja. Simpan nomor
                tiket ini untuk memantau perkembangan secara langsung.
              </p>
            </div>
          </div>

          {/* Action Links (Hidden on Print) */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <Button
              asChild
              variant="outline"
              className="border-warm-300 text-darknavy-900 hover:bg-warm-100 rounded-full font-bold"
            >
              <Link to="/">
                <Home className="mr-1.5 h-4 w-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </Button>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="outline"
                className="border-warm-300 text-darknavy-900 hover:bg-warm-100 rounded-full font-bold"
              >
                <Link to={isDapil ? '/form/aspiration' : '/form/complaint'}>
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  <span>{isDapil ? 'Buat Usulan Lain' : 'Buat Aduan Baru'}</span>
                </Link>
              </Button>

              <Button
                asChild
                className="coral-glow bg-accent-500 hover:bg-accent-600 rounded-full font-bold text-white shadow-md"
              >
                <Link to="/#lacak-tiket">
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  <span>Lacak Status Tiket</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
