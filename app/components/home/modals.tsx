import { useState } from 'react';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import type { Category, NewAspirationInput } from '@/types/aspiration';

import { AGENCIES, CATEGORIES } from '@/constants/aspirations';

import { PenLine, Route, Send, ShieldCheck } from 'lucide-react';

interface AspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: NewAspirationInput) => void;
}

export function AspirationModal({ isOpen, onClose, onSubmit }: AspirationModalProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Category>('Infrastruktur');
  const [agency, setAgency] = useState('Komisi III DPRD (Pembangunan & Infrastruktur)');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      author: isAnonymous ? 'Warga Anonim' : author,
      location,
      category,
      agency,
      title,
      content,
      isAnonymous,
    });
    setAuthor('');
    setLocation('');
    setTitle('');
    setContent('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-0 sm:max-w-lg">
        <DialogHeader className="bg-darknavy-900 rounded-t-3xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-accent-500/20 text-accent-500 flex h-9 w-9 items-center justify-center rounded-xl">
              <PenLine className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                Tulis Aspirasi Baru
              </DialogTitle>
              <DialogDescription className="text-2xs text-slate-400">
                Sampaikan suara Anda secara langsung dan terbuka demi kemajuan bersama.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Mode Anonim Toggle */}
          <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-2xl border p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="text-accent-500 flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <label
                  htmlFor="anon-check-modal"
                  className="text-darknavy-900 cursor-pointer text-xs font-bold"
                >
                  Kirim secara Anonim
                </label>
                <p className="text-2xs text-slate-500">Nama Anda tidak akan dipublikasikan</p>
              </div>
            </div>
            <Switch id="anon-check-modal" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="modal-author"
                className="text-darknavy-900 text-2xs mb-1 block font-bold"
              >
                Nama Pelapor
              </label>
              <Input
                id="modal-author"
                type="text"
                required={!isAnonymous}
                disabled={isAnonymous}
                value={isAnonymous ? 'Warga Anonim' : author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama Anda"
                className="border-warm-200 bg-warm-100"
              />
            </div>
            <div>
              <label
                htmlFor="modal-location"
                className="text-darknavy-900 text-2xs mb-1 block font-bold"
              >
                Lokasi / Kecamatan
              </label>
              <Input
                id="modal-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Misal: Kec. Coblong"
                className="border-warm-200 bg-warm-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="modal-category"
                className="text-darknavy-900 text-2xs mb-1 block font-bold"
              >
                Kategori Laporan
              </label>
              <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger id="modal-category" className="border-warm-200 bg-warm-100">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== 'semua').map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="modal-agency"
                className="text-darknavy-900 text-2xs mb-1 block font-bold"
              >
                Tujuan Komisi / Sekretariat DPRD
              </label>
              <Select value={agency} onValueChange={setAgency}>
                <SelectTrigger id="modal-agency" className="border-warm-200 bg-warm-100">
                  <SelectValue placeholder="Pilih Komisi / Bagian DPRD" />
                </SelectTrigger>
                <SelectContent>
                  {AGENCIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label
              htmlFor="modal-title"
              className="text-darknavy-900 text-2xs mb-1 block font-bold"
            >
              Judul Aspirasi
            </label>
            <Input
              id="modal-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Perbaikan Lampu Jalan Rusak"
              className="border-warm-200 bg-warm-100"
            />
          </div>

          <div>
            <label
              htmlFor="modal-content"
              className="text-darknavy-900 text-2xs mb-1 block font-bold"
            >
              Isi Aspirasi / Keluhan
            </label>
            <Textarea
              id="modal-content"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jelaskan detail persoalan yang dialami..."
              className="border-warm-200 bg-warm-100"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="bg-accent-500 hover:bg-accent-600 flex w-full items-center justify-center gap-2 rounded-full py-6 text-xs font-bold text-white shadow-lg"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kirim Aspirasi Sekarang</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface TrackModalProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
}

export function TrackModal({ isOpen, ticketId, onClose }: TrackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 overflow-hidden rounded-3xl bg-white p-0 sm:max-w-md">
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
          {/* Summary Box */}
          <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-2xl border p-4">
            <div>
              <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                Kode Tiket
              </p>
              <p className="text-darknavy-900 font-mono text-base font-extrabold">{ticketId}</p>
            </div>
            <Badge
              variant="outline"
              className="text-2xs border-none bg-amber-100 px-3 py-1 font-bold text-amber-700"
            >
              Dalam Proses
            </Badge>
          </div>

          {/* 4-Step Vertical Timeline */}
          <div className="border-warm-300 relative space-y-4 border-l-2 pl-4">
            <div className="relative">
              <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              <p className="text-darknavy-900 text-xs font-bold">Laporan Diterima</p>
              <p className="text-2xs text-slate-400">17 Agt 2026 • 09:12 WIB — Masuk ke sistem</p>
            </div>
            <div className="relative">
              <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              <p className="text-darknavy-900 text-xs font-bold">Terverifikasi Admin</p>
              <p className="text-2xs text-slate-400">
                17 Agt 2026 • 10:45 WIB — Diteruskan ke Komisi DPRD
              </p>
            </div>
            <div className="relative">
              <span className="bg-accent-500 ring-accent-100 absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white ring-4" />
              <p className="text-accent-500 text-xs font-bold">Progres Lapangan</p>
              <p className="text-2xs text-slate-500">Petugas teknis melakukan peninjauan lokasi.</p>
            </div>
            <div className="relative opacity-40">
              <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-slate-300" />
              <p className="text-xs font-bold text-slate-700">Penanganan Selesai</p>
              <p className="text-2xs text-slate-400">Menunggu konfirmasi final pelapor.</p>
            </div>
          </div>

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
