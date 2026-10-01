import * as React from 'react';

import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  type AdminTicketItem,
  type AdminTicketStatus,
} from '@/constants/admin-data';

import {
  Building2,
  Check,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: AdminTicketItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: AdminTicketStatus, newNotes: string) => void;
}

export function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onStatusChange,
}: TicketDetailModalProps) {
  if (!ticket) return null;

  return (
    <TicketDetailDialog
      key={ticket.id}
      ticket={ticket}
      isOpen={isOpen}
      onClose={onClose}
      onStatusChange={onStatusChange}
    />
  );
}

function TicketDetailDialog({
  ticket,
  isOpen,
  onClose,
  onStatusChange,
}: {
  ticket: AdminTicketItem;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: AdminTicketStatus, newNotes: string) => void;
}) {
  const [currentStatus, setCurrentStatus] = React.useState<AdminTicketStatus>(ticket.status);
  const [adminNotes, setAdminNotes] = React.useState(ticket.adminNotes || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showFullKtp, setShowFullKtp] = React.useState(false);

  const isDapil = ticket.type === 'dapil';
  const statusMeta = ADMIN_STATUS_META[currentStatus];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onStatusChange(ticket.id, currentStatus, adminNotes);
      setIsSaving(false);
      toast.success('Status Berhasil Diperbarui', {
        description: `Tiket ${ticket.id} kini berstatus: ${ADMIN_STATUS_META[currentStatus].label}.`,
      });
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-3xl border bg-white p-0 shadow-2xl">
        {/* Obsidian Header */}
        <DialogHeader className="bg-darknavy-900 shrink-0 p-6 text-left text-white sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  isDapil ? 'bg-emerald-500' : 'bg-accent-500'
                } text-white shadow-lg`}
              >
                {isDapil ? <Landmark className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent-400 font-mono text-xs font-bold tracking-wider">
                    {ticket.id}
                  </span>
                  <span className="text-slate-400">•</span>
                  <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-200"
                  >
                    {isDapil ? 'Aspirasi Dapil DPRD' : 'Aduan Pelayanan Publik'}
                  </Badge>
                </div>
                <DialogTitle className="line-clamp-1 text-lg font-extrabold text-white sm:text-xl">
                  {ticket.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300 sm:text-sm">
                  Didaftarkan pada {ticket.createdAt} WITA • SLA Sisa: {ticket.slaHoursRemaining}{' '}
                  Jam
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`inline-flex items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-xs font-bold ${statusMeta.bg} ${statusMeta.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
              <span>{statusMeta.label}</span>
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable Body Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-7">
          {/* Section 1: Data Identitas Pelapor (UU PDP) */}
          <div className="border-warm-200 bg-warm-50/70 space-y-4 rounded-2xl border p-4 sm:p-5">
            <div className="border-warm-200 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <User className="text-accent-500 h-4 w-4" />
                <h4 className="text-darknavy-900 text-xs font-extrabold tracking-wider uppercase sm:text-sm">
                  Identitas Pelapor (Terverifikasi e-KTP)
                </h4>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-full border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Valid UU PDP
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Nama Lengkap
                  </span>
                  <span className="text-darknavy-900 text-sm font-bold">
                    {ticket.reporter.name}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <span className="text-darknavy-900 font-mono text-sm font-bold tracking-wider">
                    {ticket.reporter.nik}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Kontak Telepon / WhatsApp
                  </span>
                  <span className="text-darknavy-900 flex items-center gap-2 text-sm font-semibold">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {ticket.reporter.phone}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Alamat Email
                  </span>
                  <span className="text-darknavy-900 flex items-center gap-2 text-sm font-semibold">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {ticket.reporter.email}
                  </span>
                </div>
              </div>

              {/* e-KTP Card Mockup Preview */}
              <div className="border-warm-200 space-y-2 rounded-xl border bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Tanda Pengenal e-KTP
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullKtp(!showFullKtp)}
                    className="text-accent-600 hover:text-accent-700 hover:bg-accent-50 h-7 px-2.5 text-xs font-bold"
                  >
                    {showFullKtp ? 'Perkecil' : 'Lihat Foto'}
                  </Button>
                </div>
                <div className="border-warm-200 relative overflow-hidden rounded-xl border bg-slate-100">
                  <img
                    src={ticket.reporter.idCardPreviewUrl}
                    alt={`e-KTP ${ticket.reporter.name}`}
                    className={`w-full object-cover transition-all ${
                      showFullKtp ? 'h-48' : 'h-28'
                    }`}
                  />
                  <div className="bg-darknavy-900/85 absolute right-2 bottom-2 rounded-md px-2 py-0.5 font-mono text-xs font-medium text-white shadow-xs">
                    {ticket.reporter.idCardFileName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detail Laporan / Usulan */}
          <div className="border-warm-200 space-y-4 rounded-2xl border bg-white p-4 shadow-xs sm:p-5">
            <h4 className="text-darknavy-900 border-warm-200 border-b pb-3 text-xs font-extrabold tracking-wider uppercase sm:text-sm">
              {isDapil ? 'Rincian Usulan Pokir Dapil' : 'Rincian Keluhan Pelayanan Publik'}
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {isDapil ? 'Dapil & Dewan Dituju' : 'Komisi / Alat Kelengkapan DPRD'}
                </span>
                <span className="text-darknavy-900 text-sm font-bold">
                  {ticket.targetDestination}
                </span>
                {ticket.dapilName ? (
                  <Badge
                    variant="secondary"
                    className="mt-1.5 inline-block text-xs font-semibold text-emerald-800"
                  >
                    {ticket.dapilName}
                  </Badge>
                ) : null}
              </div>

              <div>
                <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {isDapil ? 'Kamus Usulan Pokir' : 'Kategori Laporan'}
                </span>
                <span className="text-darknavy-900 text-sm font-bold">
                  {ticket.categoryOrKamus}
                </span>
              </div>

              {ticket.estimatedBudget ? (
                <div>
                  <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Estimasi Usulan Anggaran
                  </span>
                  <span className="text-accent-600 font-mono text-base font-extrabold">
                    {ticket.estimatedBudget}
                  </span>
                </div>
              ) : null}

              <div>
                <span className="mb-0.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Lokasi Geografis (Kabupaten Tapin)
                </span>
                <span className="text-darknavy-900 flex items-center gap-1.5 text-sm font-bold">
                  <MapPin className="text-accent-500 h-4 w-4 shrink-0" />
                  <span>
                    Kel. {ticket.location.kelurahan}, Kec. {ticket.location.kecamatan}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                  {ticket.location.alamatDetail}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-warm-200 bg-warm-50/60 rounded-xl border p-4">
              <span className="text-darknavy-900 mb-2 block text-xs font-extrabold tracking-wider uppercase">
                Isi Lengkap Laporan / Usulan:
              </span>
              <p className="text-sm leading-relaxed text-slate-700">{ticket.description}</p>
            </div>

            {/* Map GPS coordinates */}
            {ticket.location.latitude !== 0 && ticket.location.longitude !== 0 ? (
              <div className="border-warm-200 flex items-center justify-between rounded-xl border bg-white p-3.5">
                <div className="flex items-center gap-2">
                  <MapPin className="text-accent-500 h-4 w-4 shrink-0" />
                  <span className="font-mono text-xs text-slate-600">
                    Titik GPS Peta: {ticket.location.latitude.toFixed(5)},{' '}
                    {ticket.location.longitude.toFixed(5)}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${ticket.location.latitude},${ticket.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-600 hover:text-accent-700 flex items-center gap-1.5 text-xs font-bold"
                >
                  <span>Buka di Peta</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : null}

            {/* Evidence Photos */}
            <div>
              <span className="mb-2 block text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Bukti Lampiran Foto Lapangan:
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ticket.photos.map((photo, index) => (
                  <a
                    key={photo}
                    href={photo}
                    target="_blank"
                    rel="noreferrer"
                    className="group border-warm-200 relative block aspect-video overflow-hidden rounded-xl border bg-slate-100"
                  >
                    <img
                      src={photo}
                      alt={`Bukti Foto ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="bg-darknavy-900/40 absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <ImageIcon className="h-4 w-4" />
                      <span>Perbesar</span>
                    </div>
                  </a>
                ))}
              </div>

              {ticket.documentFileName ? (
                <div className="border-warm-200 bg-warm-50 mt-3 flex items-center justify-between rounded-xl border p-3.5">
                  <div className="flex items-center gap-3">
                    <FileText className="text-accent-500 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-darknavy-900 text-sm font-bold">
                        {ticket.documentFileName}
                      </p>
                      <p className="text-xs text-slate-500">Dokumen Lampiran PDF Resmi</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info(`Mengunduh berkas ${ticket.documentFileName}...`)}
                    className="border-warm-300 gap-1.5 rounded-lg text-xs font-semibold"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Unduh Berkas</span>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Section 3: Penilaian Kepuasan Aplikasi (CSAT Warga) - Redesigned to match Screenshot 2 */}
          {ticket.satisfaction ? (
            <div className="border-accent-200 bg-accent-50/40 space-y-3.5 rounded-2xl border p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <h4 className="text-darknavy-900 text-xs font-extrabold tracking-wider uppercase sm:text-sm">
                    Survei Kepuasan Aplikasi oleh Warga
                  </h4>
                </div>
                <Badge
                  variant="outline"
                  className="text-darknavy-900 border-accent-300 bg-white px-3 py-1 text-xs font-bold shadow-2xs"
                >
                  Rating: {ticket.satisfaction.rating}/5 ★
                </Badge>
              </div>

              {/* Aspect Pills (Screenshot 2 Design) */}
              <div className="flex flex-wrap gap-2 pt-1">
                {ticket.satisfaction.aspects.map((aspect) => (
                  <span
                    key={aspect}
                    className="border-warm-200/90 text-darknavy-900 inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-semibold shadow-2xs"
                  >
                    <Check className="text-accent-500 h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{aspect}</span>
                  </span>
                ))}
              </div>

              {ticket.satisfaction.feedback ? (
                <div className="border-warm-200 rounded-xl border bg-white/90 p-3.5">
                  <p className="text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                    "{ticket.satisfaction.feedback}"
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Section 4: Aksi Status & Catatan Tindak Lanjut Admin with shadcn Select, Input, Textarea */}
          <div className="border-darknavy-800 bg-darknavy-900 space-y-4 rounded-2xl p-5 text-white sm:p-6">
            <h4 className="text-accent-400 text-xs font-extrabold tracking-wider uppercase sm:text-sm">
              Pembaruan Status & Tindak Lanjut Petugas
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Ubah Status Tiket:
                </label>
                <Select
                  value={currentStatus}
                  onValueChange={(val) => setCurrentStatus(val as AdminTicketStatus)}
                >
                  <SelectTrigger className="border-darknavy-700 bg-darknavy-800 focus:ring-accent-500 h-10.5 w-full rounded-xl text-xs text-white sm:text-sm">
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
                    <SelectItem value="ditolak">Ditolak / Tidak Sesuai Ketentuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Petugas Disposisi:
                </label>
                <Input
                  type="text"
                  readOnly
                  value={ticket.assignedTo || 'Tim Admin SI-WADAY Tapin'}
                  className="border-darknavy-700 bg-darknavy-800/60 h-10.5 w-full cursor-not-allowed rounded-xl text-xs text-slate-300 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-300 uppercase">
                Catatan Resmi Admin & Berita Acara Lapangan:
              </label>
              <Textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Tuliskan catatan disposisi, instruksi lapangan, atau verifikasi teknis di sini..."
                className="border-darknavy-700 bg-darknavy-800 focus-visible:ring-accent-500 w-full rounded-xl text-xs leading-relaxed text-white placeholder:text-slate-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-warm-200 bg-warm-50 flex shrink-0 items-center justify-between border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-warm-300 rounded-full px-5 text-xs font-semibold sm:text-sm"
          >
            Tutup
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="coral-glow bg-accent-500 hover:bg-accent-600 gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md sm:text-sm"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
