import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

interface DapilBadgeProps {
  dapil: string;
  className?: string;
}

interface DapilStyle {
  className: string;
  dotColor: string;
}

function getDapilStyle(dapilName: string): DapilStyle {
  const normalized = dapilName.trim().toLowerCase();

  if (
    normalized.includes('kalimantan selatan') ||
    normalized.includes('kalsel') ||
    normalized.includes('dpr')
  ) {
    return {
      className:
        'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
      dotColor: 'bg-amber-500',
    };
  }

  if (
    normalized.includes('1') ||
    normalized.includes('dapil 1') ||
    normalized.includes('tapin 1')
  ) {
    return {
      className:
        'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200',
      dotColor: 'bg-teal-500',
    };
  }

  if (
    normalized.includes('2') ||
    normalized.includes('dapil 2') ||
    normalized.includes('tapin 2')
  ) {
    return {
      className:
        'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200',
      dotColor: 'bg-violet-500',
    };
  }

  if (
    normalized.includes('3') ||
    normalized.includes('dapil 3') ||
    normalized.includes('tapin 3')
  ) {
    return {
      className:
        'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200',
      dotColor: 'bg-rose-500',
    };
  }

  return {
    className:
      'border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
    dotColor: 'bg-slate-400',
  };
}

export function DapilBadge({ dapil, className }: DapilBadgeProps) {
  if (!dapil || dapil === '-') {
    return <span className="text-xs text-slate-400">-</span>;
  }

  const { className: styleClass, dotColor } = getDapilStyle(dapil);

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-2xs transition-all',
        styleClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotColor)} aria-hidden="true" />
      <span className="truncate">{dapil}</span>
    </Badge>
  );
}
