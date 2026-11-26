import * as React from 'react';

import { Outlet, useNavigation } from 'react-router';

import { requireAuth } from '@/lib/session.server';
import { cn } from '@/lib/utils';

import { AdminHeader } from '@/components/dashboard/admin/admin-header';
import {
  DetailPageSkeleton,
  OverviewSkeleton,
  SatisfactionSkeleton,
  TableViewSkeleton,
} from '@/components/dashboard/admin/dashboard-skeletons';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Toaster } from '@/components/ui/sonner';

import type { Route } from './+types/admin-layout';

export const meta: Route.MetaFunction = () => [
  { title: 'Dashboard Admin • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content:
      'Pusat Kendali Terpadu Aduan Pelayanan Publik dan Pokok Pikiran (Pokir) DPRD Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);
  const currentUser = authResult.user;

  const payload = { currentUser };
  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

function resolveDashboardSkeleton(pathname: string) {
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return <OverviewSkeleton />;
  }
  if (pathname.startsWith('/dashboard/satisfaction')) {
    return <SatisfactionSkeleton />;
  }
  if (
    pathname.startsWith('/dashboard/aspirations/') ||
    pathname.startsWith('/dashboard/complaints/') ||
    pathname.startsWith('/dashboard/users/legislators/') ||
    pathname.startsWith('/dashboard/users/moderators/')
  ) {
    return <DetailPageSkeleton />;
  }
  return <TableViewSkeleton />;
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigation = useNavigation();
  const isDashboardLoading =
    navigation.state === 'loading' &&
    Boolean(navigation.location?.pathname.startsWith('/dashboard'));

  return (
    <div className="bg-warm-100 text-darknavy-900 selection:bg-accent-500 flex min-h-dvh font-sans antialiased selection:text-white">
      {/* Persistent Sidebar Navigation */}
      <AdminSidebar
        currentUser={loaderData.currentUser}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-all duration-300',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        {/* Sticky Header */}
        <div className="bg-warm-100/85 sticky top-0 z-30 w-full px-4 pt-4 pb-2 backdrop-blur-md sm:px-6 sm:pt-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
          </div>
        </div>

        {/* Dynamic Nested Content */}
        <div className="w-full flex-1 px-4 pt-2 pb-6 sm:px-6 sm:pb-8 lg:px-8">
          <main className="mx-auto max-w-7xl">
            {isDashboardLoading && navigation.location ? (
              resolveDashboardSkeleton(navigation.location.pathname)
            ) : (
              <Outlet context={{ currentUser: loaderData.currentUser }} />
            )}
          </main>
        </div>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
