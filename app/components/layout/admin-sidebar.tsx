import { cn } from '@/lib/utils';

import { TooltipProvider } from '@/components/ui/tooltip';

import { AdminSidebarHeader } from './admin-sidebar/admin-sidebar-header';
import { AdminSidebarNav } from './admin-sidebar/admin-sidebar-nav';
import { AdminSidebarUserMenu } from './admin-sidebar/admin-sidebar-user-menu';
import { type AdminTab } from './admin-sidebar/types';

export type { AdminTab };

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSearchFocus?: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onSearchFocus,
}: AdminSidebarProps) {
  const renderSidebarContent = (collapsed: boolean, onDrawerClose?: () => void) => (
    <div
      className={cn(
        'text-darknavy-900 flex h-full flex-col justify-between bg-white',
        collapsed ? 'w-full items-center py-4' : ''
      )}
    >
      <div className={cn('flex flex-col', collapsed ? 'items-center' : '')}>
        <AdminSidebarHeader
          isCollapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onCloseMobile={onDrawerClose}
          onSearchFocus={onSearchFocus}
        />
        <AdminSidebarNav
          activeTab={activeTab}
          onTabChange={onTabChange}
          isCollapsed={collapsed}
          onCloseMobile={onDrawerClose}
        />
      </div>

      <AdminSidebarUserMenu isCollapsed={collapsed} />
    </div>
  );

  return (
    <TooltipProvider delayDuration={150}>
      {/* Desktop Persistent Sidebar (Collapsible) */}
      <aside
        className={cn(
          'border-warm-200/90 fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-white shadow-xs transition-all duration-300 ease-in-out lg:flex',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>

      {/* Mobile Drawer Overlay (Always Full Size when opened) */}
      {isOpenMobile ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="bg-darknavy-950/60 fixed inset-0 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Pane */}
          <div className="relative z-10 w-72 max-w-[85vw] flex-1 shadow-2xl">
            {renderSidebarContent(false, onCloseMobile)}
          </div>
        </div>
      ) : null}
    </TooltipProvider>
  );
}
