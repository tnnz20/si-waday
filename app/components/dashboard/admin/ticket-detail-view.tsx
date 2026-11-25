import * as React from 'react';

import { updateTicketStatusSchema } from '@/schema/ticket';
import { Link, useFetcher } from 'react-router';
import { toast } from 'sonner';

import type { AuthUserPayload } from '@/lib/auth.server';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  ADMIN_STATUS_META,
  type AdminTicketStatus,
  type TicketDetailItem,
  formatIndonesianDateTime,
} from '@/constants/admin-data';

import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  History,
  ImageIcon,
  Landmark,
  Mail,
  MapPin,
  MessageSquareHeart,
  Phone,
  Save,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';

interface TicketDetailViewProps {
  ticket: TicketDetailItem;
  currentUser: AuthUserPayload;
  backHref: string;
  backLabel: string;
}

export function TicketDetailView({
  ticket,
  currentUser,
  backHref,
  backLabel,
}: TicketDetailViewProps) {
  const fetcher = useFetcher<{
    success?: boolean;
    message?: string;
    error?: string;
    fieldErrors?: Record<string, string>;
  }>();
  const prevFetcherState = React.useRef(fetcher.state);

  const [selectedStatus, setSelectedStatus] = React.useState<AdminTicketStatus>(ticket.status);
  const [adminNotes, setAdminNotes] = React.useState(ticket.adminNotes || '');
  const [clientFieldErrors, setClientFieldErrors] = React.useState<Record<string, string>>({});
  const [showFullKtp, setShowFullKtp] = React.useState(false);
  const [brokenImages, setBrokenImages] = React.useState<Record<string, boolean>>({});

  // Sync form state when ticket prop changes across navigations
  const [prevTicketKey, setPrevTicketKey] = React.useState(`${ticket.id}-${ticket.updatedAt}`);
  const currentTicketKey = `${ticket.id}-${ticket.updatedAt}`;
  if (prevTicketKey !== currentTicketKey) {
    setPrevTicketKey(currentTicketKey);
    setSelectedStatus(ticket.status);
    setAdminNotes(ticket.adminNotes || '');
    setClientFieldErrors({});
    setBrokenImages({});
  }

  const markImageBroken = (url: string) => {
    setBrokenImages((prev) => ({ ...prev, [url]: true }));
  };

  React.useEffect(() => {
    if (prevFetcherState.current !== 'idle' && fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success) {
        toast.success('Pembaruan Disimpan', {
          description: fetcher.data.message || `Status tiket ${ticket.ticketNumber} diperbarui.`,
        });
      } else if (fetcher.data.error) {
        toast.error('Gagal Memperbarui Tiket', {
          description: fetcher.data.error,
        });
      }
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, ticket.ticketNumber]);

  const isSubmitting = fetcher.state !== 'idle';
  const serverFieldErrors = fetcher.data?.fieldErrors || {};
  const fieldErrors = { ...serverFieldErrors, ...clientFieldErrors };

  const isDapil = ticket.type === 'dapil';
  const statusMeta = ADMIN_STATUS_META[ticket.status];
  const isAdmin = currentUser.role === 'admin';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = updateTicketStatusSchema.safeParse({
      ticketNumber: ticket.ticketNumber,
      status: selectedStatus,
      adminNotes,
    });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || '');
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setClientFieldErrors(nextErrors);
      return;
    }

    setClientFieldErrors({});
    const formData = new FormData();
    formData.append('status', parsed.data.status);
    formData.append('adminNotes', parsed.data.adminNotes);
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-200">
      {/* Top Toolbar: Back Button & Live Status Pill */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Button
          asChild
          variant="outline"
          className="border-warm-200 text-darknavy-900 hover:bg-warm-100 w-fit gap-2 rounded-2xl text-xs font-bold shadow-2xs sm:text-sm"
        >
          <Link to={backHref}>
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold ${statusMeta.bg} ${statusMeta.text}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
            <span>{statusMeta.label}</span>
          </Badge>
        </div>
      </div>

      {/* Card 1: Ticket Hero Banner + Identitas Pelapor (UU PDP) */}
      <Card className="border-warm-200 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="bg-darknavy-900 relative overflow-hidden p-6 text-white sm:p-8">
          <div className="bg-accent-500/15 pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${
                  isDapil ? 'bg-emerald-500' : 'bg-accent-500'
                }`}
              >
                {isDapil ? <Landmark className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-accent-400 font-mono text-xs font-bold tracking-wider sm:text-sm">
                    {ticket.ticketNumber}
                  </span>
                  <span className="text-slate-500">•</span>
                  <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-200"
                  >
                    {isDapil ? 'Aspirasi Pokir Dapil DPRD' : 'Aduan Pengawasan Masyarakat'}
                  </Badge>
                </div>
                <h1 className="text-lg leading-snug font-extrabold text-white sm:text-2xl">
                  {ticket.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Masuk: {formatIndonesianDateTime(ticket.createdAt)} WITA
                  </span>
                  {ticket.resolvedAt ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selesai: {formatIndonesianDateTime(ticket.resolvedAt)} WITA
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Reporter Identity (UU PDP Protected) */}
        <CardContent className="p-6 sm:p-8">
          <div className="border-warm-200 mb-5 flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
            <div className="flex items-center gap-2">
              <User className="text-accent-500 h-4 w-4" />
              <h2 className="text-darknavy-900 text-xs font-extrabold tracking-wider uppercase sm:text-sm">
                Identitas Pelapor (Terverifikasi e-KTP)
              </h2>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 rounded-full border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Dilindungi UU PDP
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
              <div>
                <span className="text-2xs mb-0.5 block font-bold tracking-wider text-slate-400 uppercase">
                  Nama Lengkap
                </span>
                <p className="text-darknavy-900 text-sm font-bold">{ticket.reporter.name}</p>
              </div>
              <div>
                <span className="text-2xs mb-0.5 block font-bold tracking-wider text-slate-400 uppercase">
                  Nomor Induk Kependudukan (NIK)
                </span>
                <p className="text-darknavy-900 font-mono text-sm font-bold tracking-wider">
                  {ticket.reporter.nik}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-2xs mb-0.5 block font-bold tracking-wider text-slate-400 uppercase">
                    Telepon / WhatsApp
                  </span>
                  <p className="text-darknavy-900 flex items-center gap-1.5 text-sm font-semibold">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{ticket.reporter.phone}</span>
                  </p>
                </div>
                <div>
                  <span className="text-2xs mb-0.5 block font-bold tracking-wider text-slate-400 uppercase">
                    Email
                  </span>
                  <p className="text-darknavy-900 flex items-center gap-1.5 truncate text-sm font-semibold">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{ticket.reporter.email || '-'}</span>
                  </p>
                </div>
              </div>
              <div>
                <span className="text-2xs mb-0.5 block font-bold tracking-wider text-slate-400 uppercase">
                  Alamat Domisili KTP
                </span>
                <p className="text-sm leading-relaxed text-slate-700">{ticket.reporter.address}</p>
              </div>
            </div>

            {/* e-KTP Photo Box */}
            <div className="border-warm-200 bg-warm-50/50 space-y-2.5 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Tanda Pengenal e-KTP
                </span>
                {ticket.reporter.idCardUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullKtp((prev) => !prev)}
                    className="text-accent-600 hover:text-accent-700 hover:bg-accent-50 h-7 px-2.5 text-xs font-bold"
                  >
                    {showFullKtp ? 'Perkecil' : 'Perbesar Foto'}
                  </Button>
                ) : null}
              </div>

              {ticket.reporter.idCardUrl && !brokenImages[ticket.reporter.idCardUrl] ? (
                <div className="border-warm-200 relative overflow-hidden rounded-xl border bg-slate-100">
                  <img
                    src={ticket.reporter.idCardUrl}
                    alt={`e-KTP ${ticket.reporter.name}`}
                    onError={() => {
                      if (ticket.reporter.idCardUrl) {
                        markImageBroken(ticket.reporter.idCardUrl);
                      }
                    }}
                    className={`w-full object-cover transition-all ${
                      showFullKtp ? 'h-64' : 'h-36'
                    }`}
                  />
                </div>
              ) : (
                <Empty className="border-warm-200 border bg-white p-5">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ImageIcon className="text-slate-400" />
                    </EmptyMedia>
                    <EmptyTitle className="text-darknavy-900 text-xs font-bold">
                      Lampiran e-KTP Tidak Tersedia
                    </EmptyTitle>
                    <EmptyDescription className="text-2xs text-slate-500">
                      Berkas foto kartu identitas tidak disertakan pada entri tiket ini.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Rincian Usulan / Keluhan, Peta Lokasi & Lampiran Berkas */}
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
        <CardHeader className="border-warm-200 border-b p-6 pb-4">
          <CardTitle className="text-darknavy-900 text-base font-extrabold sm:text-lg">
            {isDapil ? 'Rincian Usulan Pokir Dapil' : 'Rincian Aduan Pelayanan Publik'}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Informasi tujuan disposisi, lokasi geografis Tapin, kronologi, serta berkas lampiran
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <span className="text-2xs mb-1 block font-bold tracking-wider text-slate-400 uppercase">
                {isDapil ? 'Anggota Dewan & Dapil Dituju' : 'Komisi / Alat Kelengkapan DPRD'}
              </span>
              {isDapil && ticket.representative ? (
                <div className="space-y-1.5">
                  {isAdmin ? (
                    <Link
                      to={`/dashboard/users/legislators/${ticket.representative.slug}`}
                      className="text-darknavy-900 hover:text-accent-600 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
                    >
                      <span>{ticket.representative.fullName}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <p className="text-darknavy-900 text-sm font-bold">
                      {ticket.representative.fullName}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ticket.dapilName ? (
                      <Badge
                        variant="secondary"
                        className="border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800"
                      >
                        {ticket.dapilName}
                      </Badge>
                    ) : null}
                    {ticket.representative.party ? (
                      <Badge variant="outline" className="text-xs font-medium text-slate-600">
                        {ticket.representative.party}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="text-darknavy-900 text-sm font-bold">
                  {isDapil
                    ? ticket.dapilName || 'Perwakilan DPRD Kabupaten Tapin'
                    : ticket.agency || '-'}
                </p>
              )}
            </div>

            <div>
              <span className="text-2xs mb-1 block font-bold tracking-wider text-slate-400 uppercase">
                {isDapil ? 'Kamus Usulan Pokir' : 'Kategori Aduan'}
              </span>
              <p className="text-darknavy-900 text-sm font-bold">
                {isDapil ? ticket.kamusUsulan || '-' : ticket.category || '-'}
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="text-2xs mb-1 block font-bold tracking-wider text-slate-400 uppercase">
                Lokasi Geografis ({ticket.location.kabupaten})
              </span>
              <p className="text-darknavy-900 flex items-center gap-1.5 text-sm font-bold">
                <MapPin className="text-accent-500 h-4 w-4 shrink-0" />
                <span>
                  {ticket.location.kelurahan}, Kec. {ticket.location.kecamatan}
                </span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {ticket.location.alamatLokasi}
              </p>
            </div>
          </div>

          {/* Full Description */}
          <div className="border-warm-200 bg-warm-50/60 rounded-2xl border p-4 sm:p-5">
            <span className="text-darknavy-900 mb-2 block text-xs font-extrabold tracking-wider uppercase">
              Uraian Lengkap {isDapil ? 'Permasalahan & Usulan' : 'Kronologi Aduan'}:
            </span>
            <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">
              {ticket.description}
            </p>
          </div>

          {/* GPS Coordinates */}
          {ticket.location.latitude !== 0 && ticket.location.longitude !== 0 ? (
            <div className="border-warm-200 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-accent-500 h-4 w-4 shrink-0" />
                <span className="font-mono text-xs text-slate-600 sm:text-sm">
                  Koordinat GPS: {ticket.location.latitude.toFixed(6)},{' '}
                  {ticket.location.longitude.toFixed(6)}
                </span>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-warm-200 text-accent-600 hover:text-accent-700 rounded-xl text-xs font-bold"
              >
                <a
                  href={`https://www.google.com/maps?q=${ticket.location.latitude},${ticket.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ) : null}

          {/* Photos & Document Attachments */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <span className="mb-2.5 block text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Bukti Foto Lapangan ({ticket.photos.length})
              </span>
              {ticket.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {ticket.photos.map((photo, index) =>
                    brokenImages[photo] ? (
                      <div
                        key={photo}
                        className="border-warm-200 flex aspect-video flex-col items-center justify-center rounded-2xl border bg-slate-50 p-3 text-center text-xs text-slate-400"
                      >
                        <ImageIcon className="mb-1 h-4 w-4" />
                        <span>Gambar tidak tersedia</span>
                      </div>
                    ) : (
                      <a
                        key={photo}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        className="group border-warm-200 relative block aspect-video overflow-hidden rounded-2xl border bg-slate-100"
                      >
                        <img
                          src={photo}
                          alt={`Bukti Foto ${index + 1}`}
                          onError={() => markImageBroken(photo)}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="bg-darknavy-900/45 absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <ImageIcon className="h-4 w-4" />
                          <span>Perbesar</span>
                        </div>
                      </a>
                    )
                  )}
                </div>
              ) : (
                <Empty className="border-warm-200 border bg-slate-50/40 p-6">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ImageIcon className="text-slate-400" />
                    </EmptyMedia>
                    <EmptyTitle className="text-darknavy-900 text-xs font-bold">
                      Tidak Ada Foto Lapangan
                    </EmptyTitle>
                    <EmptyDescription className="text-2xs text-slate-500">
                      Pelapor tidak melampirkan dokumentasi foto kondisi lapangan.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>

            <div>
              <span className="mb-2.5 block text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Dokumen Pendukung (PDF)
              </span>
              {ticket.documentUrl ? (
                <div className="border-warm-200 bg-warm-50 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="text-accent-500 h-5 w-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-darknavy-900 truncate text-sm font-bold">
                        {ticket.documentUrl}
                      </p>
                      <p className="text-xs text-slate-500">Berkas Proposal / Surat Pendukung</p>
                    </div>
                  </div>
                  {ticket.documentUrl.startsWith('/uploads/') ||
                  ticket.documentUrl.startsWith('https://') ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-warm-300 gap-1.5 rounded-xl text-xs font-semibold"
                    >
                      <a
                        href={ticket.documentUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Unduh Berkas</span>
                      </a>
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-2xs font-semibold text-slate-500">
                      Arsip Referensi
                    </Badge>
                  )}
                </div>
              ) : (
                <Empty className="border-warm-200 border bg-slate-50/40 p-6">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileText className="text-slate-400" />
                    </EmptyMedia>
                    <EmptyTitle className="text-darknavy-900 text-xs font-bold">
                      Tidak Ada Dokumen PDF
                    </EmptyTitle>
                    <EmptyDescription className="text-2xs text-slate-500">
                      Tidak ada dokumen proposal atau surat pengantar terlampir.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Status Update Form & Audit Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Update Action Form */}
        <Card className="border-darknavy-800 bg-darknavy-900 rounded-3xl text-white shadow-sm">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-accent-400 text-sm font-extrabold tracking-wider uppercase sm:text-base">
              Pembaruan Status &amp; Tindak Lanjut
            </CardTitle>
            <CardDescription className="text-xs text-slate-300">
              Setiap perubahan status tercatat permanen pada database &amp; log audit
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="ticket-status-select"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  Status Penanganan Tiket
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={(val) => {
                    setSelectedStatus(val as AdminTicketStatus);
                    if (clientFieldErrors.status) {
                      setClientFieldErrors((prev) => ({ ...prev, status: '' }));
                    }
                  }}
                >
                  <SelectTrigger
                    id="ticket-status-select"
                    aria-invalid={fieldErrors.status ? 'true' : undefined}
                    aria-describedby={fieldErrors.status ? 'status-error' : undefined}
                    className={`border-darknavy-700 bg-darknavy-800 focus:ring-accent-500 h-10.5 w-full rounded-xl text-xs text-white sm:text-sm ${
                      fieldErrors.status ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="terverifikasi">
                      Terverifikasi (Lolos Administrasi)
                    </SelectItem>
                    <SelectItem value="sedang_diproses">
                      Sedang Diproses (Disposisi Komisi / Anggota Dewan)
                    </SelectItem>
                    <SelectItem value="selesai">Selesai Ditindaklanjuti</SelectItem>
                    <SelectItem value="ditolak">Ditolak / Tidak Memenuhi Syarat</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.status ? (
                  <p id="status-error" className="text-2xs mt-1 font-semibold text-rose-400">
                    {fieldErrors.status}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="assigned-staff-input"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  Petugas Penangan Terakhir
                </label>
                <Input
                  id="assigned-staff-input"
                  type="text"
                  readOnly
                  value={ticket.assignedToName || ticket.assignedToEmail || 'Belum Ditugaskan'}
                  className="border-darknavy-700 bg-darknavy-800/60 h-10 w-full cursor-not-allowed rounded-xl text-xs text-slate-300 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-notes-textarea"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  Catatan Resmi &amp; Berita Acara
                </label>
                <Textarea
                  id="admin-notes-textarea"
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => {
                    setAdminNotes(e.target.value);
                    if (clientFieldErrors.adminNotes) {
                      setClientFieldErrors((prev) => ({ ...prev, adminNotes: '' }));
                    }
                  }}
                  aria-invalid={fieldErrors.adminNotes ? 'true' : undefined}
                  aria-describedby={fieldErrors.adminNotes ? 'adminNotes-error' : undefined}
                  placeholder="Tuliskan catatan disposisi, tindak lanjut lapangan, atau alasan keputusan..."
                  className={`border-darknavy-700 bg-darknavy-800 focus-visible:ring-accent-500 w-full rounded-xl text-xs leading-relaxed text-white placeholder:text-slate-500 sm:text-sm ${
                    fieldErrors.adminNotes ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  }`}
                />
                {fieldErrors.adminNotes ? (
                  <p id="adminNotes-error" className="text-2xs mt-1 font-semibold text-rose-400">
                    {fieldErrors.adminNotes}
                  </p>
                ) : null}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="coral-glow bg-accent-500 hover:bg-accent-600 w-full gap-2 rounded-full py-2.5 text-xs font-bold text-white shadow-md sm:w-auto sm:px-6 sm:text-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Audit History Timeline Card */}
        <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
          <CardHeader className="p-6 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <History className="h-4.5 w-4.5" />
              </div>
              <div>
                <CardTitle className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                  Riwayat Tindak Lanjut &amp; Audit
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Jejak pembaruan status dan disposisi petugas
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            {ticket.auditLogs.length === 0 ? (
              <Empty className="border-warm-200 border bg-slate-50/40 py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <History className="text-slate-400" />
                  </EmptyMedia>
                  <EmptyTitle className="text-darknavy-900 text-sm font-bold">
                    Belum Ada Riwayat Audit
                  </EmptyTitle>
                  <EmptyDescription className="text-xs text-slate-500">
                    Perubahan status atau catatan tindak lanjut petugas akan terekam di sini.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="relative space-y-5 border-l-2 border-slate-200 pl-4 sm:pl-6">
                {ticket.auditLogs.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="border-accent-500 bg-warm-100 absolute top-1.5 -left-[21px] h-3 w-3 rounded-full border-2 sm:-left-[29px]" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-2xs rounded-md font-bold uppercase"
                        >
                          {log.action}
                        </Badge>
                        <span className="text-2xs text-slate-400">
                          {formatIndonesianDateTime(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-darknavy-900 text-xs font-bold sm:text-sm">
                        {log.description}
                      </p>
                      <p className="text-2xs text-slate-500">
                        Oleh:{' '}
                        <strong className="text-slate-700">
                          {log.actorName} ({log.actorRole})
                        </strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card 4 (Separate Card at Bottom): Citizen Satisfaction Feedback */}
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
        <CardHeader className="border-warm-200 flex flex-row flex-wrap items-center justify-between gap-3 border-b p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600">
              <MessageSquareHeart className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                Umpan Balik &amp; Kepuasan Warga
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Penilaian langsung dari pelapor atas kemudahan formulir maupun penyelesaian tiket
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="border-warm-200 bg-warm-50 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {ticket.feedbacks.length} Penilaian Tercatat
          </Badge>
        </CardHeader>

        <CardContent className="p-6">
          {ticket.feedbacks.length === 0 ? (
            <Empty className="border-warm-200 border bg-slate-50/40 py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Star className="text-amber-500" />
                </EmptyMedia>
                <EmptyTitle className="text-darknavy-900 text-sm font-bold">
                  Belum Ada Umpan Balik Warga
                </EmptyTitle>
                <EmptyDescription className="text-xs text-slate-500">
                  Pelapor belum mengirimkan ulasan survei kepuasan untuk tiket {ticket.ticketNumber}
                  .
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {ticket.feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="border-accent-200 bg-accent-50/40 space-y-3.5 rounded-2xl border p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <h3 className="text-darknavy-900 text-xs font-extrabold tracking-wider uppercase">
                        {fb.type === 'resolution'
                          ? 'Survei Penyelesaian Tiket'
                          : 'Survei Pengisian Formulir'}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-darknavy-900 border-accent-300 bg-white px-3 py-0.5 text-xs font-bold shadow-2xs"
                    >
                      Rating: {fb.rating}/5 ★
                    </Badge>
                  </div>

                  {fb.aspects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {fb.aspects.map((aspect) => (
                        <span
                          key={aspect}
                          className="border-warm-200 text-darknavy-900 inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-semibold shadow-2xs"
                        >
                          <Check className="text-accent-500 h-3.5 w-3.5 stroke-2" />
                          <span>{aspect}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {fb.feedback ? (
                    <blockquote className="border-warm-200 rounded-xl border bg-white p-3.5 text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                      "{fb.feedback}"
                    </blockquote>
                  ) : null}

                  <p className="text-2xs text-slate-500">
                    Dikirim pada {formatIndonesianDateTime(fb.createdAt)} WITA
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
