import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Check, CheckCircle2, Heart, MessageSquare, Star } from 'lucide-react';

interface SatisfactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  aspects: string[];
  feedback: string;
  onChange: (updates: { rating?: number; aspects?: string[]; feedback?: string }) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isSubmitting?: boolean;
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

export function SatisfactionModal({
  isOpen,
  onClose,
  rating,
  aspects,
  feedback,
  onChange,
  onSubmit,
  onSkip,
  isSubmitting = false,
}: SatisfactionModalProps) {
  const [hoveredStar, setHoveredStar] = React.useState<number | null>(null);

  const activeRating = hoveredStar !== null ? hoveredStar : rating;
  const currentLabel = RATING_LABELS[activeRating] || RATING_LABELS[5];

  const toggleAspect = (aspect: string) => {
    const nextAspects = aspects.includes(aspect)
      ? aspects.filter((item) => item !== aspect)
      : [...aspects, aspect];
    onChange({ aspects: nextAspects });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 max-w-lg overflow-hidden rounded-3xl border bg-white p-0 shadow-2xl">
        {/* Header Section */}
        <DialogHeader className="bg-darknavy-900 relative overflow-hidden p-6 text-left text-white sm:p-7">
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
                  Formulir Selesai Diisi
                </Badge>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">Survei CSAT</span>
              </div>
              <DialogTitle className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                Penilaian Kepuasan Aplikasi
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300">
                Bantu kami meningkatkan kualitas layanan digital pengaduan Kabupaten Tapin.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="space-y-5 p-6 sm:p-7">
          {/* Star Rating Box */}
          <div className="border-warm-200 bg-warm-50/60 rounded-2xl border p-4.5 text-center shadow-xs">
            <p className="text-darknavy-900 mb-2.5 text-xs font-bold sm:text-sm">
              Seberapa mudah dan memuaskan pengalaman Anda menggunakan SI-WADAY hari ini?
            </p>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= activeRating;
                return (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Beri rating ${star} dari 5 bintang`}
                    onClick={() => onChange({ rating: star })}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="group p-1.5 transition-transform hover:scale-115 focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-150 sm:h-9 sm:w-9 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-slate-300 group-hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-2">
              <span className="text-darknavy-900 font-mono text-xs font-extrabold sm:text-sm">
                {activeRating} / 5 Bintang
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-xs font-bold sm:text-sm ${currentLabel.color}`}>
                {currentLabel.text}
              </span>
            </div>
          </div>

          {/* Aspect Pills (Matching Screenshot 2 Design) */}
          <div className="space-y-2">
            <label className="text-darknavy-900 block text-xs font-bold tracking-wider text-slate-500 uppercase">
              Aspek yang Paling Membantu Anda:
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_OPTIONS.map((item) => {
                const isSelected = aspects.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAspect(item)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-darknavy-900 bg-darknavy-900 text-white shadow-xs'
                        : 'border-warm-200/90 bg-warm-50/80 text-darknavy-900 hover:border-warm-300 hover:bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="text-accent-400 h-3.5 w-3.5 stroke-[2.5]" />
                    ) : (
                      <span className="text-slate-400">+</span>
                    )}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Feedback Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="modal-satisfaction-feedback"
              className="text-darknavy-900 flex items-center gap-1.5 text-xs font-bold"
            >
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
              <span>Saran atau Masukan Tambahan untuk Aplikasi (Opsional):</span>
            </label>
            <Input
              id="modal-satisfaction-feedback"
              type="text"
              value={feedback}
              onChange={(e) => onChange({ feedback: e.target.value })}
              placeholder="Contoh: Sangat praktis, alurnya cepat dan informasi dapilnya jelas..."
              className="border-warm-200 text-darknavy-900 focus-visible:border-accent-500 focus-visible:ring-accent-500/20 bg-warm-50/60 h-10 w-full rounded-xl px-3.5 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus-visible:bg-white sm:text-sm"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-warm-200 bg-warm-50/90 flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row sm:px-7 sm:py-5">
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={isSubmitting}
            className="hover:text-darknavy-900 w-full rounded-full text-xs font-semibold text-slate-500 sm:w-auto"
          >
            Lewati Penilaian
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="coral-glow bg-accent-500 hover:bg-accent-600 w-full gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md sm:w-auto sm:text-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Kirim Ulasan & Selesai'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
