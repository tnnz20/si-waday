import * as React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  ADMIN_KPI_DATA,
  type AdminTicketItem,
  CSAT_ASPECT_RATINGS,
  CSAT_DISTRIBUTION,
} from '@/constants/admin-data';

import { Check, MessageSquare, Sparkles, Star } from 'lucide-react';

interface SatisfactionTabProps {
  tickets: AdminTicketItem[];
}

export function SatisfactionTab({ tickets }: SatisfactionTabProps) {
  // Extract all tickets that have satisfaction data
  const ticketsWithReviews = React.useMemo(() => {
    return tickets.filter((t) => t.satisfaction && t.satisfaction.rating > 0);
  }, [tickets]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top CSAT Hero Card with shadcn Card */}
      <Card className="soft-card border-warm-200 from-warm-50/50 rounded-3xl border bg-linear-to-b to-white shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Big Score Block */}
            <div className="border-warm-200 flex flex-col justify-center border-b pb-6 lg:border-r lg:border-b-0 lg:pr-8 lg:pb-0">
              <span className="text-accent-500 flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Customer Satisfaction Score (CSAT)</span>
              </span>

              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-darknavy-900 text-5xl font-black tracking-tight sm:text-6xl">
                  {ADMIN_KPI_DATA.averageCsatRating}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="block text-xs font-bold text-slate-400">Skala Maksimal 5.0</span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Berdasarkan <strong>{ADMIN_KPI_DATA.totalCsatReviews} ulasan masyarakat</strong>{' '}
                yang mengajukan formulir aduan publik dan usulan dapil di Kabupaten Tapin.
              </p>
            </div>

            {/* Star Distribution Bars */}
            <div className="border-warm-200 space-y-3 border-b pb-6 lg:border-r lg:border-b-0 lg:px-8 lg:pb-0">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Distribusi Bintang Penilaian
              </h4>

              <div className="space-y-2.5">
                {CSAT_DISTRIBUTION.map((d) => (
                  <div key={d.star} className="flex items-center gap-3 text-sm">
                    <span className="text-darknavy-900 flex w-12 items-center gap-1.5 font-bold">
                      <span>{d.star}</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="bg-warm-100 h-2.5 flex-1 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${d.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-xs font-semibold text-slate-500">
                      {d.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aspects Ranking */}
            <div className="space-y-3.5 lg:pl-8">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Aspek Paling Membantu Warga
              </h4>

              <div className="space-y-2.5">
                {CSAT_ASPECT_RATINGS.map((aspect) => (
                  <div key={aspect.name} className="flex items-center justify-between text-sm">
                    <span className="max-w-[210px] truncate font-medium text-slate-700">
                      {aspect.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                    >
                      {aspect.score}% Puas
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Citizen Review Stream */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-accent-50 text-accent-500 flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                Komentar & Ulasan Warga Terbaru
              </h3>
              <p className="text-xs text-slate-500">
                Umpan balik langsung setelah warga menyelesaikan formulir
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="border-warm-200 bg-warm-50 self-start px-3 py-1 text-xs font-semibold text-slate-600 sm:self-auto"
          >
            Total {ticketsWithReviews.length} Testimoni Warga
          </Badge>
        </div>

        {/* Testimonials Grid with Redesigned Aspect Badges (Screenshot 2) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {ticketsWithReviews.map((ticket) => {
            const review = ticket.satisfaction!;
            const initials = ticket.reporter.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <Card
                key={ticket.id}
                className="soft-card border-warm-200 rounded-3xl border bg-white shadow-xs transition-all hover:shadow-md"
              >
                <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-warm-200 h-10 w-10 border shadow-2xs">
                        <AvatarFallback className="bg-warm-100 text-darknavy-900 text-xs font-extrabold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-darknavy-900 text-sm font-extrabold sm:text-base">
                          {ticket.reporter.name}
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-xs text-slate-500">
                          Kec. {ticket.location.kecamatan} • Tiket{' '}
                          <span className="font-mono font-bold text-slate-700">{ticket.id}</span>
                        </CardDescription>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/70 px-2.5 py-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-xs font-extrabold text-amber-700">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
                  {/* Testimonial Quote with Relaxed Leading */}
                  <blockquote className="border-warm-200/90 bg-warm-50/70 rounded-2xl border p-3.5 text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                    "
                    {review.feedback ||
                      'Pelayanan formulir aplikasi sangat memuaskan, responsif, dan mudah dipahami.'}
                    "
                  </blockquote>

                  {/* Redesigned Aspect Chips (Screenshot 2: Readable, Polished, Spacious) */}
                  <div className="space-y-1.5">
                    <p className="text-2xs font-bold tracking-wider text-slate-400 uppercase">
                      Aspek Yang Disukai:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {review.aspects.map((aspect) => (
                        <span
                          key={aspect}
                          className="border-warm-200/90 bg-warm-50/80 hover:bg-warm-100 text-darknavy-900 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <Check className="text-accent-500 h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                          <span>{aspect}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
