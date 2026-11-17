import * as React from 'react';

import { Form } from 'react-router';

import type { AuthUserPayload } from '@/lib/auth.server';
import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';

import { LogOut } from 'lucide-react';

import { AdminSidebarHeader } from './admin-sidebar/admin-sidebar-header';
import { AdminSidebarNav } from './admin-sidebar/admin-sidebar-nav';
import { AdminSidebarUserMenu } from './admin-sidebar/admin-sidebar-user-menu';
import { type AdminTab } from './admin-sidebar/types';

export type { AdminTab };

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  currentUser?: AuthUserPayload;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSearchFocus?: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  currentUser,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onSearchFocus,
}: AdminSidebarProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

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
          currentUser={currentUser}
          isCollapsed={collapsed}
          onCloseMobile={onDrawerClose}
        />
      </div>

      <AdminSidebarUserMenu
        currentUser={currentUser}
        isCollapsed={collapsed}
        onOpenLogoutDialog={() => setIsLogoutDialogOpen(true)}
      />
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

      {/* Mobile Drawer Overlay */}
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

      {/* Logout Confirmation Dialog (shadcn AlertDialog) */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-md">
          <AlertDialogHeader className="space-y-2 text-center sm:text-left">
            <AlertDialogTitle className="text-darknavy-900 text-lg font-black">
              Konfirmasi Keluar dari Sistem
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 sm:text-sm">
              Apakah Anda yakin ingin mengakhiri sesi aktif ini? Anda harus memasukkan kredensial
              akun kembali untuk mengakses dashboard SI-WADAY.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="border-warm-200 rounded-xl text-xs font-bold sm:text-sm">
              Batal
            </AlertDialogCancel>
            <Form method="post" action="/auth/logout">
              <Button
                type="submit"
                variant="destructive"
                className="w-full rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 sm:w-auto sm:text-sm"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Ya, Keluar
              </Button>
            </Form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
