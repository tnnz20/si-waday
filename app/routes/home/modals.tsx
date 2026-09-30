import { useState } from 'react';

import { CheckCircle2, Info, PenLine, Route, Send, UserCheck, X } from 'lucide-react';

import type { Category, NewAspirationInput } from '@/types/aspiration';
import type { ToastMessage } from '@/types/ui';

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
  const [agency, setAgency] = useState('Dinas PUPR');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

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
    // Reset form
    setAuthor('');
    setLocation('');
    setTitle('');
    setContent('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="bg-darknavy-950/70 modal-backdrop-animate fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm"
    >
      <div className="border-warm-200 modal-content-animate my-8 w-full max-w-lg overflow-hidden rounded-3xl border bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="bg-darknavy-900 flex items-center justify-between px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-accent-500/20 text-accent-500 flex h-8 w-8 items-center justify-center rounded-xl">
              <PenLine className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Tulis Aspirasi Baru</h3>
              <p className="text-[10px] text-slate-400">
                Sampaikan keluhan atau ide untuk kota Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Anonymous Toggle Switch */}
          <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-2xl border p-3.5">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-slate-600" aria-hidden="true" />
              <div>
                <p className="text-darknavy-900 text-xs font-bold">Kirim secara Anonim</p>
                <p className="text-[10px] text-slate-500">
                  Identitas Anda disembunyikan dari publik
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer peer-checked:bg-accent-500 h-5 w-10 rounded-full bg-slate-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>

          {/* Author & Location Fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="author-input"
                className="text-darknavy-900 mb-1 block text-[11px] font-bold"
              >
                Nama Lengkap *
              </label>
              <input
                id="author-input"
                type="text"
                disabled={isAnonymous}
                value={isAnonymous ? 'Warga Anonim' : author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama Anda"
                required={!isAnonymous}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs transition-all focus:outline-none ${
                  isAnonymous
                    ? 'border-warm-200 bg-warm-200 cursor-not-allowed text-slate-500'
                    : 'bg-warm-100 border-warm-200 focus:ring-accent-500 focus:ring-2'
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="location-input"
                className="text-darknavy-900 mb-1 block text-[11px] font-bold"
              >
                Kecamatan / Lokasi *
              </label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Misal: Kec. Merdeka"
                required
                className="bg-warm-100 border-warm-200 focus:ring-accent-500 w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Agency Selection */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category-select"
                className="text-darknavy-900 mb-1 block text-[11px] font-bold"
              >
                Kategori *
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                required
                className="bg-warm-100 border-warm-200 focus:ring-accent-500 w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-2 focus:outline-none"
              >
                <option value="Infrastruktur">Infrastruktur &amp; Jalan</option>
                <option value="Pelayanan Publik">Pelayanan Publik</option>
                <option value="Kebersihan &amp; Lingkungan">Kebersihan &amp; Lingkungan</option>
                <option value="Kesehatan">Kesehatan &amp; Sosial</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="agency-select"
                className="text-darknavy-900 mb-1 block text-[11px] font-bold"
              >
                Instansi Tujuan
              </label>
              <select
                id="agency-select"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="bg-warm-100 border-warm-200 focus:ring-accent-500 w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-2 focus:outline-none"
              >
                <option value="Dinas PUPR">Dinas PUPR</option>
                <option value="Dinas Perhubungan">Dinas Perhubungan</option>
                <option value="Dinas Lingkungan Hidup">Dinas Lingkungan Hidup</option>
                <option value="Dinas Kesehatan">Dinas Kesehatan</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title-input"
              className="text-darknavy-900 mb-1 block text-[11px] font-bold"
            >
              Judul Aspirasi *
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Perbaikan penerangan jalan umum di RT 02"
              required
              className="bg-warm-100 border-warm-200 focus:ring-accent-500 w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content-textarea"
              className="text-darknavy-900 mb-1 block text-[11px] font-bold"
            >
              Detail Laporan *
            </label>
            <textarea
              id="content-textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Uraikan detail lokasi dan permasalahan..."
              required
              className="bg-warm-100 border-warm-200 focus:ring-accent-500 w-full resize-none rounded-xl border px-3.5 py-2.5 text-xs focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="border-warm-200 flex items-center justify-end gap-3 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-warm-100 rounded-full px-5 py-2.5 text-xs font-bold text-slate-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-accent-500 hover:bg-accent-600 flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kirim Aspirasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TrackModalProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
}

export function TrackModal({ isOpen, ticketId, onClose }: TrackModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="bg-darknavy-950/70 modal-backdrop-animate fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div className="border-warm-200 modal-content-animate w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-darknavy-900 flex items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Route className="text-accent-500 h-4 w-4" aria-hidden="true" />
            <h3 className="text-xs font-bold">Status Penanganan Tiket</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Summary Box */}
          <div className="bg-warm-100 border-warm-200 flex items-center justify-between rounded-2xl border p-4">
            <div>
              <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                Kode Tiket
              </p>
              <p className="text-darknavy-900 font-mono text-base font-extrabold">{ticketId}</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-700">
              Dalam Proses
            </span>
          </div>

          {/* 4-Step Vertical Timeline */}
          <div className="border-warm-300 relative space-y-4 border-l-2 pl-4">
            <div className="relative">
              <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              <p className="text-darknavy-900 text-xs font-bold">Laporan Diterima</p>
              <p className="text-[10px] text-slate-400">
                17 Agt 2026 • 09:12 WIB — Masuk ke sistem
              </p>
            </div>
            <div className="relative">
              <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              <p className="text-darknavy-900 text-xs font-bold">Terverifikasi Admin</p>
              <p className="text-[10px] text-slate-400">
                17 Agt 2026 • 10:45 WIB — Diteruskan ke instansi
              </p>
            </div>
            <div className="relative">
              <span className="bg-accent-500 ring-accent-100 absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white ring-4" />
              <p className="text-accent-500 text-xs font-bold">Progres Lapangan</p>
              <p className="text-[10px] text-slate-500">
                Petugas teknis melakukan peninjauan lokasi.
              </p>
            </div>
            <div className="relative opacity-40">
              <span className="absolute top-0 -left-[21px] h-3 w-3 rounded-full border-2 border-white bg-slate-300" />
              <p className="text-xs font-bold text-slate-700">Penanganan Selesai</p>
              <p className="text-[10px] text-slate-400">Menunggu konfirmasi final pelapor.</p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-darknavy-900 hover:bg-darknavy-800 w-full rounded-full py-2.5 text-xs font-bold text-white transition-colors"
            >
              Tutup Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-5 bottom-5 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-animate pointer-events-auto flex items-center gap-3 rounded-full px-5 py-3.5 text-xs font-semibold shadow-2xl transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-darknavy-900 border-accent-500/40 border text-white'
              : 'bg-darknavy-900 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          ) : (
            <Info className="text-accent-500 h-4 w-4" aria-hidden="true" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
