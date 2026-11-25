import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function OverviewSkeleton() {
  return (
    <div
      className="space-y-6 sm:space-y-8"
      aria-busy="true"
      aria-label="Memuat ringkasan dashboard"
    >
      {/* Banner Skeleton */}
      <div className="bg-darknavy-900 rounded-3xl p-6 shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="bg-darknavy-800 h-6 w-40 rounded-full" />
              <Skeleton className="bg-darknavy-800 h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="bg-darknavy-800 h-8 w-72 rounded-xl sm:w-96" />
            <Skeleton className="bg-darknavy-800 h-4 w-full max-w-xl rounded-md" />
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Skeleton className="bg-darknavy-800 h-11 w-40 rounded-full" />
            <Skeleton className="bg-darknavy-800 h-11 w-40 rounded-full" />
          </div>
        </div>
      </div>

      {/* KPI Row Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="border-warm-200 rounded-3xl border bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2.5">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </CardHeader>
            <CardContent className="space-y-2.5 p-5 pt-0 sm:p-6 sm:pt-0">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-3.5 w-40 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-warm-200 rounded-3xl border bg-white shadow-sm lg:col-span-2">
          <CardHeader className="border-warm-200 border-b p-6 pb-4">
            <Skeleton className="h-6 w-60 rounded-lg" />
            <Skeleton className="mt-1.5 h-3.5 w-48 rounded-md" />
          </CardHeader>
          <CardContent className="divide-warm-100 divide-y p-4 sm:p-6">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3.5">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-48 rounded-md" />
                    <Skeleton className="h-4 w-64 rounded-md sm:w-80" />
                    <Skeleton className="h-3 w-40 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-7 w-28 shrink-0 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-warm-200 rounded-3xl border bg-white shadow-sm">
            <CardHeader className="p-6 pb-3">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="mt-1 h-3 w-52 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {[1, 2, 3, 4].map((bar) => (
                <div key={bar} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                    <Skeleton className="h-3.5 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-warm-200 rounded-3xl border bg-white shadow-sm">
            <CardHeader className="p-6 pb-2">
              <Skeleton className="h-4 w-44 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-3.5 w-32 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TableViewSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8" aria-busy="true" aria-label="Memuat tabel data">
      {/* Top 3 KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="border-warm-200 rounded-3xl bg-white shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32 rounded-md" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
                <Skeleton className="h-11 w-11 rounded-2xl" />
              </div>
              <Skeleton className="mt-3 h-3 w-40 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="border-warm-200 overflow-hidden rounded-3xl bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-64 rounded-lg" />
              <Skeleton className="h-4 w-80 rounded-md" />
            </div>
            <Skeleton className="h-10 w-full rounded-2xl sm:w-64" />
          </div>
          <div className="border-warm-200/80 mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
            <Skeleton className="h-9 w-64 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-warm-200/70 divide-y px-6">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex items-center justify-between gap-4 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
                <div className="hidden space-y-2 sm:block">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
                <div className="hidden space-y-2 md:block">
                  <Skeleton className="h-4 w-52 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="border-warm-200 bg-warm-50/50 flex items-center justify-between border-t px-6 py-4">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-8 w-24 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SatisfactionSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8" aria-busy="true" aria-label="Memuat survei kepuasan">
      {/* Top Hero Analytics Card */}
      <Card className="border-warm-200 rounded-3xl border bg-white shadow-sm">
        <CardContent className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-3">
          <div className="space-y-3">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-14 w-32 rounded-2xl" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-40 rounded-md" />
            {[1, 2, 3, 4, 5].map((bar) => (
              <div key={bar} className="flex items-center gap-3">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-2.5 flex-1 rounded-full" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-44 rounded-md" />
            {[1, 2, 3, 4].map((aspect) => (
              <div key={aspect} className="flex items-center justify-between">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6 Review Card Skeletons (default 6 per page) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-60 rounded-lg" />
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((card) => (
            <Card key={card} className="border-warm-200 rounded-3xl border bg-white shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between p-5 pb-3 sm:p-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-36 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat detail data">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-52 rounded-2xl" />
        <Skeleton className="h-8 w-36 rounded-full" />
      </div>

      <Card className="border-warm-200 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="bg-darknavy-900 space-y-3 p-6 sm:p-8">
          <Skeleton className="bg-darknavy-800 h-5 w-44 rounded-full" />
          <Skeleton className="bg-darknavy-800 h-8 w-80 rounded-xl" />
          <Skeleton className="bg-darknavy-800 h-4 w-60 rounded-md" />
        </div>
        <CardContent className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-5 w-52 rounded-md" />
          </div>
          <Skeleton className="h-44 w-full rounded-2xl" />
        </CardContent>
      </Card>

      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <Skeleton className="h-5 w-52 rounded-md" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="aspect-video w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Separate Feedback Card Skeleton */}
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
        <CardHeader className="p-6 pb-3">
          <Skeleton className="h-5 w-56 rounded-md" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Skeleton className="h-24 w-full rounded-2xl" />
        </CardContent>
      </Card>
    </div>
  );
}
