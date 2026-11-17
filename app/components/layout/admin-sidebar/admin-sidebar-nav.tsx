import * as React from 'react';

import type { AuthUserPayload } from '@/lib/auth.server';
import { cn } from '@/lib/utils';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ChevronRight, Landmark, ShieldCheck, Users } from 'lucide-react';

import { ADMIN_NAV_ITEMS, type AdminTab } from './types';

interface AdminSidebarNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  currentUser?: AuthUserPayload;
  isCollapsed?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebarNav({
  activeTab,
  onTabChange,
  currentUser,
  isCollapsed = false,
  onCloseMobile,
}: AdminSidebarNavProps) {
  const isAdmin = currentUser?.role === 'admin';
  const isUserManagementActive = activeTab === 'users-dewan' || activeTab === 'users-moderator';
  const [userGroupExpanded, setUserGroupExpanded] = React.useState<boolean | null>(null);
  const isUserGroupOpen = userGroupExpanded ?? isUserManagementActive;

  const visibleNavItems = ADMIN_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  if (isCollapsed) {
    return (
      <nav className="space-y-2" aria-label="Navigasi Menu Utama">
        {visibleNavItems.map((item) => {
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

        {/* Collapsed Icon for User Management */}
        {isAdmin ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onTabChange('users-dewan')}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                  isUserManagementActive
                    ? 'bg-warm-200/80 text-accent-500 shadow-xs'
                    : 'hover:bg-warm-100 hover:text-darknavy-900 text-slate-500'
                )}
                aria-label="Manajemen Pengguna"
              >
                <Users
                  className={cn(
                    'h-4.5 w-4.5',
                    isUserManagementActive ? 'text-accent-500' : 'text-slate-500'
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-bold">Manajemen Pengguna (Dewan / Moderator)</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </nav>
    );
  }

  return (
    <nav className="space-y-1.5 px-3.5 pt-2" aria-label="Navigasi Menu Utama">
      <p className="text-2xs px-2.5 pt-1 pb-1.5 font-extrabold tracking-wider text-slate-400 uppercase">
        Menu Utama
      </p>

      {visibleNavItems.map((item) => {
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

      {/* Admin-only: Collapsible User Management Group */}
      {isAdmin ? (
        <Collapsible
          open={isUserGroupOpen}
          onOpenChange={(open) => setUserGroupExpanded(open)}
          className="pt-2"
        >
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150',
                isUserManagementActive
                  ? 'text-darknavy-900 font-extrabold'
                  : 'hover:bg-warm-100/80 hover:text-darknavy-900 text-slate-600'
              )}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={cn(
                    'h-4.5 w-4.5 shrink-0 transition-colors',
                    isUserManagementActive
                      ? 'text-accent-500'
                      : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span className="truncate leading-normal">Manajemen Pengguna</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                  isUserGroupOpen ? 'rotate-90' : ''
                )}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 pt-1 pr-1 pl-4">
            <button
              type="button"
              onClick={() => {
                onTabChange('users-dewan');
                if (onCloseMobile) onCloseMobile();
              }}
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150',
                activeTab === 'users-dewan'
                  ? 'bg-warm-200/80 text-darknavy-900 font-extrabold shadow-2xs'
                  : 'hover:bg-warm-100/80 hover:text-darknavy-900 text-slate-600'
              )}
            >
              <Landmark
                className={cn(
                  'h-4 w-4 shrink-0',
                  activeTab === 'users-dewan' ? 'text-accent-500' : 'text-slate-400'
                )}
              />
              <span className="truncate">Anggota Dewan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onTabChange('users-moderator');
                if (onCloseMobile) onCloseMobile();
              }}
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150',
                activeTab === 'users-moderator'
                  ? 'bg-warm-200/80 text-darknavy-900 font-extrabold shadow-2xs'
                  : 'hover:bg-warm-100/80 hover:text-darknavy-900 text-slate-600'
              )}
            >
              <ShieldCheck
                className={cn(
                  'h-4 w-4 shrink-0',
                  activeTab === 'users-moderator' ? 'text-accent-500' : 'text-slate-400'
                )}
              />
              <span className="truncate">Moderator Regional</span>
            </button>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </nav>
  );
}
