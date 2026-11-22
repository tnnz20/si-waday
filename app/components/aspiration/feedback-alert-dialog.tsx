import * as React from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Check, CheckCircle2, Heart, MessageSquare, Star } from 'lucide-react';

export interface FeedbackAlertDialogProps {
  isOpen: boolean;
  ticketNumber: string;
  aspirationType: 'dapil' | 'masyarakat';
  rating: number;
  aspects: string[];
  feedback: string;
  isSubmitting?: boolean;
  onChange: (updates: { rating?: number; aspects?: string[]; feedback?: string }) => void;
  onSubmit: () => void;
}

const RATING_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: 'Perlu Perbaikan', color: 'text-rose-500' },
  2: { text: 'Kurang Puas', color: 'text-amber-500' },
  3: { text: 'Cukup Baik', color: 'text-amber-600' },
  4: { text: 'Sangat Baik', color: 'text-emerald-600' },
  5: { text: 'Sangat Memuaskan & Cepat', color: 'text-accent-500' },
};

const ASPECT_OPTIONS = [
  'Formulir Mudah Dipahami',
  'Kecepatan Akses Lancar',
  'Tampilan Rapi & Jelas',
  'Petunjuk Tooltip Informatif',
  'Akurasi Pin Peta Lokasi',
  'Transparansi Alur Aduan',
];

export function FeedbackAlertDialog({
  isOpen,
  ticketNumber,
  aspirationType,
  rating,
  aspects,
  feedback,
  isSubmitting = false,
  onChange,
  onSubmit,
}: FeedbackAlertDialogProps) {
  const [hoveredStar, setHoveredStar] = React.useState<number | null>(null);

  const activeRating = hoveredStar !== null ? hoveredStar : rating;
  const currentLabel = RATING_LABELS[activeRating] || RATING_LABELS[5];

  const toggleAspect = (aspect: string) => {
    const nextAspects = aspects.includes(aspect)
      ? aspects.filter((item) => item !== aspect)
      : [...aspects, aspect];
    onChange({ aspects: nextAspects });
  };

  const isDapil = aspirationType === 'dapil';

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="border-warm-200 max-w-lg overflow-hidden rounded-3xl border bg-white p-0 shadow-2xl"
      >
        {/* Header Section */}
        <AlertDialogHeader className="bg-darknavy-900 relative overflow-hidden p-6 text-left text-white sm:p-7">
          <div className="bg-accent-500/15 pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl" />

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg ring-4 ring-amber-500/20">
              <Heart className="h-6 w-6 fill-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-amber-400/40 bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold tracking-wider text-amber-300 uppercase"
                >
                  {isDapil ? 'Aspirasi Berhasil Dicatat' : 'Aduan Berhasil Dicatat'}
                </Badge>
                <span className="text-xs text-slate-400">•</span>
                <span className="font-mono text-xs font-bold text-slate-300">{ticketNumber}</span>
              </div>
              <AlertDialogTitle className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                Beri Penilaian Pengalaman Anda
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-300">
                Satu langkah terakhir: Bantu kami mengevaluasi kemudahan layanan digital SI-WADAY
                Kabupaten Tapin sebelum melihat bukti registrasi resmi Anda.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Modal Body */}
        <div className="space-y-5 p-6 sm:p-7">
          {/* Star Rating Box */}
          <div className="border-warm-200 bg-warm-50/60 rounded-2xl border p-4.5 text-center shadow-xs">
            <p className="text-darknavy-900 mb-2.5 text-xs font-bold sm:text-sm">
              Seberapa mudah dan memuaskan pengalaman Anda menggunakan formulir SI-WADAY?
            </p>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= activeRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onChange({ rating: star })}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-hidden"
                    aria-label={`Beri bintang ${star}`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors sm:h-9 sm:w-9 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-2">
              <span className={`font-mono text-sm font-extrabold ${currentLabel.color}`}>
                {activeRating}.0 / 5.0
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-xs font-bold sm:text-sm ${currentLabel.color}`}>
                {currentLabel.text}
              </span>
            </div>
          </div>

          {/* Aspect Chips */}
          <div className="space-y-2">
            <p className="text-darknavy-900 text-xs font-bold">
              Aspek yang paling membantu Anda (Pilih yang sesuai):
            </p>
            <div className="flex flex-wrap gap-2">
              {ASPECT_OPTIONS.map((aspect) => {
                const isSelected = aspects.includes(aspect);
                return (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => toggleAspect(aspect)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-warm-200 hover:border-warm-300 hover:bg-warm-50 bg-white text-slate-600'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 stroke-2 text-emerald-600" />
                    ) : null}
                    <span>{aspect}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="alert-satisfaction-feedback"
              className="text-darknavy-900 flex items-center gap-1.5 text-xs font-bold"
            >
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
              <span>Saran atau Masukan Tambahan untuk Aplikasi (Opsional):</span>
            </label>
            <Input
              id="alert-satisfaction-feedback"
              type="text"
              value={feedback}
              onChange={(e) => onChange({ feedback: e.target.value })}
              placeholder="Contoh: Formulirnya sangat cepat diisi dan petunjuknya jelas..."
              className="border-warm-200 text-darknavy-900 focus-visible:border-accent-500 focus-visible:ring-accent-500/20 bg-warm-50/60 h-10 w-full rounded-xl px-3.5 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus-visible:bg-white sm:text-sm"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <AlertDialogFooter className="border-warm-200 bg-warm-50/90 flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row sm:px-7 sm:py-5">
          <p className="text-2xs text-center text-slate-500 sm:text-left">
            Penilaian Anda dicatat resmi dalam Indeks Kepuasan Masyarakat (IKM).
          </p>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || rating === 0}
            className="coral-glow bg-accent-500 hover:bg-accent-600 w-full gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md sm:w-auto sm:text-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Kirim Penilaian & Lihat Bukti Tiket'}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
