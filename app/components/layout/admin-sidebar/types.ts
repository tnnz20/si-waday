import type * as React from 'react';

import { Landmark, LayoutDashboard, Megaphone, Star } from 'lucide-react';

export interface AdminNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  adminOnly?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    to: '/dashboard',
    label: 'Ringkasan Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/dashboard/complaints',
    label: 'Aduan Masyarakat',
    icon: Megaphone,
    adminOnly: true,
  },
  {
    to: '/dashboard/aspirations',
    label: 'Aspirasi Dapil DPRD',
    icon: Landmark,
  },
  {
    to: '/dashboard/satisfaction',
    label: 'Survei Kepuasan CSAT',
    icon: Star,
    adminOnly: true,
  },
];
