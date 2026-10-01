import * as React from 'react';

import { cn } from '@/lib/utils';

import { CheckCircle2, Heart, MessageSquare, Star } from 'lucide-react';

export interface SatisfactionSurveyProps {
  rating: number;
  aspects: string[];
  feedback: string;
  onChange: (updates: { rating?: number; aspects?: string[]; feedback?: string }) => void;
  className?: string;
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

export function SatisfactionSurvey({
  rating,
  aspects,
  feedback,
  onChange,
  className,
}: SatisfactionSurveyProps) {
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
    <div
      className={cn(
        'border-warm-200 from-warm-50/80 space-y-5 rounded-3xl border bg-linear-to-b to-white p-5 shadow-xs sm:p-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="bg-accent-50 text-accent-500 border-accent-100 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
            <Heart className="fill-accent-500 h-5 w-5" />
          </div>
          <div>
            <h3 className="text-darknavy-900 text-sm font-extrabold sm:text-base">
              Penilaian Kepuasan Aplikasi
            </h3>
            <p className="text-xs text-slate-500">
              Bantu kami meningkatkan kualitas layanan digital warga Kabupaten Tapin
            </p>
          </div>
        </div>
        <span className="text-2xs bg-accent-50 text-accent-600 border-accent-200 inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 font-semibold sm:self-center">
          <CheckCircle2 className="h-3 w-3" />
          Survei CSAT Terbuka
        </span>
      </div>

      {/* Star Rating Section */}
      <div className="border-warm-200 rounded-2xl border bg-white/80 p-4 text-center sm:p-5">
        <p className="text-darknavy-900 mb-2 text-xs font-bold sm:text-sm">
          Seberapa mudah dan memuaskan pengalaman Anda menggunakan SI-WADAY hari ini?
        </p>

        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeRating;
            return (
              <button
                key={star}
                type="button"
                aria-label={`Beri bintang ${star} dari 5`}
                onClick={() => onChange({ rating: star })}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="group p-1.5 transition-transform hover:scale-115 focus:outline-none"
              >
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors duration-150 sm:h-8 sm:w-8',
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                      : 'text-slate-300 group-hover:text-amber-300'
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="text-darknavy-900 text-xs font-extrabold">{activeRating}/5 Bintang</span>
          <span className="text-slate-300">•</span>
          <span className={cn('text-xs font-bold transition-colors', currentLabel.color)}>
            {currentLabel.text}
          </span>
        </div>
      </div>

      {/* Aspects Tags */}
      <div className="space-y-2">
        <label className="text-darknavy-900 block text-xs font-bold">
          Aspek yang Paling Membantu Anda (Bisa pilih lebih dari satu):
        </label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_OPTIONS.map((item) => {
            const isSelected = aspects.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleAspect(item)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none',
                  isSelected
                    ? 'bg-darknavy-900 text-white shadow-xs'
                    : 'border-warm-200 hover:border-warm-300 hover:bg-warm-50 border bg-white text-slate-600'
                )}
              >
                {isSelected ? '✓ ' : '+ '}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Feedback Comment */}
      <div className="space-y-1.5">
        <label
          htmlFor="satisfaction-feedback-input"
          className="text-darknavy-900 flex items-center gap-1.5 text-xs font-bold"
        >
          <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
          <span>Saran atau Masukan Tambahan untuk Aplikasi (Opsional):</span>
        </label>
        <input
          id="satisfaction-feedback-input"
          type="text"
          value={feedback}
          onChange={(e) => onChange({ feedback: e.target.value })}
          placeholder="Contoh: Sangat praktis, alurnya cepat dan informasi dapilnya jelas..."
          className="border-warm-200 text-darknavy-900 focus:border-accent-500 focus:ring-accent-500/20 w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs transition-all placeholder:text-slate-400 focus:ring-2 focus:outline-none sm:text-sm"
        />
      </div>
    </div>
  );
}
