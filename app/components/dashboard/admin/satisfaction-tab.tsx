import { Link, useNavigate } from 'react-router';

import { TablePagination } from '@/components/shared/table-pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { formatIndonesianDateTime } from '@/constants/admin-data';

import { Check, MessageSquare, Sparkles, Star } from 'lucide-react';

export interface CsatAspectStat {
  name: string;
  count: number;
  percentage: number;
}

export interface CsatDistributionStat {
  star: number;
  count: number;
  percentage: number;
}

export interface CsatAnalyticsData {
  averageRating: number;
  totalReviews: number;
  satisfactionPercentage?: number;
  distribution: CsatDistributionStat[];
  aspectRatings: CsatAspectStat[];
}

export interface CsatReviewItem {
  id: string;
  ticketNumber: string;
  type: 'submission' | 'resolution' | 'general';
  reporterName: string;
  kecamatan: string;
  rating: number;
  aspects: string[];
  feedback: string | null;
  createdAt?: string;
}

export interface SatisfactionPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface SatisfactionTabProps {
  analytics: CsatAnalyticsData;
  reviews: CsatReviewItem[];
  pagination: SatisfactionPaginationMeta;
}

export function SatisfactionTab({ analytics, reviews, pagination }: SatisfactionTabProps) {
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    navigate(`?page=${page}`);
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-200 sm:space-y-8">
      {/* Top CSAT Hero Card */}
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
                  {analytics.totalReviews > 0 ? analytics.averageRating.toFixed(1) : '—'}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-5 w-5 ${
                          analytics.totalReviews > 0 && s <= Math.round(analytics.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="block text-xs font-bold text-slate-400">Skala Maksimal 5.0</span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Berdasarkan <strong>{analytics.totalReviews} ulasan masyarakat</strong> yang
                mengajukan formulir aduan publik dan usulan dapil di Kabupaten Tapin.
              </p>
            </div>

            {/* Star Distribution Bars */}
            <div className="border-warm-200 space-y-3 border-b pb-6 lg:border-r lg:border-b-0 lg:px-8 lg:pb-0">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Distribusi Bintang Penilaian
              </h4>

              {analytics.totalReviews === 0 ? (
                <Empty className="border-warm-200 border bg-white/70 p-4">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Star className="text-slate-400" />
                    </EmptyMedia>
                    <EmptyTitle className="text-darknavy-900 text-xs font-bold">
                      Belum Ada Distribusi Penilaian
                    </EmptyTitle>
                    <EmptyDescription className="text-2xs text-slate-500">
                      Grafik bintang muncul setelah warga mengisi survei kepuasan.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-2.5">
                  {analytics.distribution.map((d) => (
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
                      <span className="w-16 text-right font-mono text-xs font-semibold text-slate-500">
                        {d.percentage}% ({d.count})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aspects Ranking */}
            <div className="space-y-3.5 lg:pl-8">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                Aspek Paling Membantu Warga
              </h4>

              {analytics.aspectRatings.length === 0 ? (
                <Empty className="border-warm-200 border bg-white/70 p-4">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Check className="text-slate-400" />
                    </EmptyMedia>
                    <EmptyTitle className="text-darknavy-900 text-xs font-bold">
                      Belum Ada Aspek Penilaian
                    </EmptyTitle>
                    <EmptyDescription className="text-2xs text-slate-500">
                      Peringkat aspek positif akan tampil otomatis dari database.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-2.5">
                  {analytics.aspectRatings.map((aspect) => (
                    <div key={aspect.name} className="flex items-center justify-between text-sm">
                      <span className="max-w-52 truncate font-medium text-slate-700">
                        {aspect.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                      >
                        {aspect.percentage}% Puas
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Citizen Review Stream (Paginated, 6 per page default) */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-accent-50 text-accent-500 flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                Komentar &amp; Ulasan Warga Terbaru
              </h3>
              <p className="text-xs text-slate-500">
                Umpan balik langsung setelah warga menyelesaikan formulir dan penyelesaian aduan
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="border-warm-200 bg-warm-50 self-start px-3 py-1 text-xs font-semibold text-slate-600 sm:self-auto"
          >
            Total {pagination.totalItems} Testimoni Warga
          </Badge>
        </div>

        {/* Testimonials Grid or Empty */}
        {reviews.length === 0 ? (
          <Card className="border-warm-200 rounded-3xl border bg-white p-4 shadow-xs">
            <Empty className="border-warm-200 border bg-slate-50/40 py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquare className="text-slate-400" />
                </EmptyMedia>
                <EmptyTitle className="text-darknavy-900 text-base font-bold">
                  Belum Ada Ulasan Masyarakat
                </EmptyTitle>
                <EmptyDescription className="text-xs text-slate-500">
                  Penilaian CSAT yang diisi warga setelah mengirim formulir atau menyelesaikan aduan
                  akan tercatat dan muncul di halaman ini.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Card>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {reviews.map((review) => {
                const initials = review.reporterName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                const isAspiration = review.ticketNumber.startsWith('ASP-');
                const detailHref = isAspiration
                  ? `/dashboard/aspirations/${review.ticketNumber}`
                  : `/dashboard/complaints/${review.ticketNumber}`;

                return (
                  <Card
                    key={review.id}
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
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle className="text-darknavy-900 text-sm font-extrabold sm:text-base">
                                {review.reporterName}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className={
                                  review.type === 'resolution'
                                    ? 'text-2xs border-emerald-300 bg-emerald-50 text-emerald-800'
                                    : 'text-2xs border-blue-300 bg-blue-50 text-blue-800'
                                }
                              >
                                {review.type === 'resolution'
                                  ? 'Penyelesaian Aduan'
                                  : 'Pengisian Formulir'}
                              </Badge>
                            </div>
                            <CardDescription className="mt-0.5 text-xs text-slate-500">
                              Kec. {review.kecamatan} • Tiket{' '}
                              <Link
                                to={detailHref}
                                className="hover:text-accent-600 font-mono font-bold text-slate-700 hover:underline"
                              >
                                {review.ticketNumber}
                              </Link>
                              {review.createdAt ? (
                                <span className="ml-1.5 text-slate-400">
                                  • {formatIndonesianDateTime(review.createdAt)}
                                </span>
                              ) : null}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/70 px-2.5 py-1">
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
                      {review.feedback ? (
                        <blockquote className="border-warm-200/90 bg-warm-50/70 rounded-2xl border p-3.5 text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                          "{review.feedback}"
                        </blockquote>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Pelapor tidak menyertakan komentar tertulis.
                        </p>
                      )}

                      {review.aspects && review.aspects.length > 0 ? (
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
                                <Check className="text-accent-500 h-3.5 w-3.5 shrink-0 stroke-2" />
                                <span>{aspect}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              className="border-warm-200 rounded-3xl border bg-white shadow-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
