import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ADMIN_NAV_ITEMS, type AdminTab } from './types';

interface AdminSidebarNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  isCollapsed?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebarNav({
  activeTab,
  onTabChange,
  isCollapsed = false,
  onCloseMobile,
}: AdminSidebarNavProps) {
  if (isCollapsed) {
    return (
      <nav className="space-y-2" aria-label="Navigasi Menu Utama">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                    isActive
                      ? 'bg-warm-200/80 text-accent-500 shadow-xs'
                      : 'hover:bg-warm-100 hover:text-darknavy-900 text-slate-500'
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={cn('h-4.5 w-4.5', isActive ? 'text-accent-500' : 'text-slate-500')}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-bold">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1.5 px-3.5 pt-2" aria-label="Navigasi Menu Utama">
      <p className="text-2xs px-2.5 pt-1 pb-1.5 font-extrabold tracking-wider text-slate-400 uppercase">
        Menu Utama
      </p>

      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onTabChange(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={cn(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-warm-200/80 text-darknavy-900 font-extrabold shadow-2xs'
                : 'hover:bg-warm-100/80 hover:text-darknavy-900 text-slate-600'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={cn(
                'h-4.5 w-4.5 shrink-0 transition-colors',
                isActive ? 'text-accent-500' : 'text-slate-400 group-hover:text-slate-600'
              )}
            />
            <span className="truncate leading-normal">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
