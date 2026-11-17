import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

interface PartyBadgeProps {
  party: string;
  className?: string;
}

interface PartyStyle {
  label: string;
  className: string;
  dotColor: string;
}

function getPartyStyle(partyName: string): PartyStyle {
  const normalized = partyName.trim().toLowerCase();

  if (normalized.includes('golkar')) {
    return {
      label: 'Golkar',
      className:
        'border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200',
      dotColor: 'bg-amber-500',
    };
  }

  if (normalized.includes('pdi') || normalized.includes('perjuangan')) {
    return {
      label: 'PDI-P',
      className:
        'border-red-300 bg-red-100 text-red-900 dark:border-red-700 dark:bg-red-950/60 dark:text-red-200',
      dotColor: 'bg-red-500',
    };
  }

  if (normalized.includes('gerindra')) {
    return {
      label: 'Gerindra',
      className:
        'border-orange-300 bg-orange-100 text-orange-900 dark:border-orange-700 dark:bg-orange-950/60 dark:text-orange-200',
      dotColor: 'bg-orange-500',
    };
  }

  if (normalized.includes('nasdem')) {
    return {
      label: 'NasDem',
      className:
        'border-indigo-300 bg-indigo-100 text-indigo-900 dark:border-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200',
      dotColor: 'bg-indigo-500',
    };
  }

  if (normalized.includes('pkb')) {
    return {
      label: 'PKB',
      className:
        'border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200',
      dotColor: 'bg-emerald-500',
    };
  }

  if (normalized.includes('demokrat')) {
    return {
      label: 'Demokrat',
      className:
        'border-blue-300 bg-blue-100 text-blue-900 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-200',
      dotColor: 'bg-blue-500',
    };
  }

  if (normalized.includes('pan')) {
    return {
      label: 'PAN',
      className:
        'border-sky-300 bg-sky-100 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200',
      dotColor: 'bg-sky-500',
    };
  }

  if (normalized.includes('pks')) {
    return {
      label: 'PKS',
      className:
        'border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
      dotColor: 'bg-amber-600',
    };
  }

  if (normalized.includes('ppp')) {
    return {
      label: 'PPP',
      className:
        'border-green-300 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-950/60 dark:text-green-200',
      dotColor: 'bg-green-600',
    };
  }

  return {
    label: partyName || '-',
    className:
      'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    dotColor: 'bg-slate-400',
  };
}

export function PartyBadge({ party, className }: PartyBadgeProps) {
  if (!party || party === '-') {
    return <span className="text-xs text-slate-400">-</span>;
  }

  const { className: styleClass, dotColor } = getPartyStyle(party);

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black shadow-2xs transition-all',
        styleClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotColor)} aria-hidden="true" />
      <span className="truncate">{party}</span>
    </Badge>
  );
}
