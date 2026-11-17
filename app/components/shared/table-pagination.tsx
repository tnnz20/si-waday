import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array (with ellipsis if totalPages is large)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        'border-warm-200 bg-warm-50/50 flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row',
        className
      )}
    >
      {/* Information Counter */}
      <div className="text-xs text-slate-500">
        Menampilkan{' '}
        <span className="text-darknavy-900 font-bold">
          {startItem}-{endItem}
        </span>{' '}
        dari <span className="text-darknavy-900 font-bold">{totalItems}</span> entri
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="border-warm-200 text-darknavy-900 hover:bg-warm-100 h-8 gap-1 rounded-xl px-2.5 text-xs font-bold disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs font-bold text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = currentPage === pageNum;

            return (
              <Button
                key={pageNum}
                type="button"
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  'h-8 min-w-8 rounded-xl px-2 text-xs font-bold transition-all',
                  isActive
                    ? 'bg-darknavy-900 text-white shadow-xs'
                    : 'hover:bg-warm-100 text-slate-600'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="border-warm-200 text-darknavy-900 hover:bg-warm-100 h-8 gap-1 rounded-xl px-2.5 text-xs font-bold disabled:opacity-40"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
