import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { Command, Layers, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

interface AdminSidebarHeaderProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  onSearchFocus?: () => void;
}

export function AdminSidebarHeader({
  isCollapsed = false,
  onToggleCollapse,
  onCloseMobile,
  onSearchFocus,
}: AdminSidebarHeaderProps) {
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-1.5">
        {onToggleCollapse ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hover:bg-warm-100 hover:text-darknavy-900 h-9 w-9 rounded-xl text-slate-500"
                aria-label="Buka Sidebar"
              >
                <PanelLeftOpen className="h-4.5 w-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-semibold">Buka Sidebar (Expand)</p>
            </TooltipContent>
          </Tooltip>
        ) : null}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onSearchFocus}
              className="hover:bg-warm-100 hover:text-darknavy-900 mt-1 h-9 w-9 rounded-xl text-slate-400"
              aria-label="Cari"
            >
              <Command className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs font-semibold">Cari data (/)</p>
          </TooltipContent>
        </Tooltip>

        <div className="border-warm-200 my-2.5 w-8 border-t" />
      </div>
    );
  }

  return (
    <>
      {/* Brand & Collapse Header */}
      <div className="flex items-center justify-between p-4 pb-2.5">
        <Link to="/dashboard" className="group flex min-w-0 items-center gap-3">
          <div className="bg-accent-500 shadow-accent-500/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-xs transition-transform group-hover:scale-105">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <span className="text-darknavy-900 truncate text-sm font-extrabold tracking-tight sm:text-base">
            SI-WADAY
          </span>
        </Link>

        {/* Desktop Collapse Button */}
        {onToggleCollapse ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hover:bg-warm-100 hover:text-darknavy-900 hidden h-8 w-8 rounded-xl text-slate-400 lg:flex"
                aria-label="Tutup Sidebar"
              >
                <PanelLeftClose className="h-4.5 w-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-semibold">Tutup Sidebar (Collapse)</p>
            </TooltipContent>
          </Tooltip>
        ) : null}

        {/* Mobile Drawer Close Button */}
        {onCloseMobile ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="hover:bg-warm-100 hover:text-darknavy-900 h-9 w-9 rounded-xl text-slate-400 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      {/* Quick Search / Command Pill */}
      <div className="px-3.5 pt-1.5 pb-2.5">
        <button
          type="button"
          onClick={onSearchFocus}
          className="border-warm-200 bg-warm-50/70 hover:bg-warm-100/70 group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs text-slate-500 shadow-2xs transition-all"
        >
          <div className="group-hover:text-darknavy-900 flex items-center gap-2.5 text-slate-500">
            <Command className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium">Cari menu / data...</span>
          </div>
          <kbd className="text-2xs border-warm-200 rounded border bg-white px-1.5 py-0.5 font-mono font-bold text-slate-400">
            /
          </kbd>
        </button>
      </div>
    </>
  );
}
