import type * as React from 'react';

import { Landmark, LayoutDashboard, Megaphone, Star } from 'lucide-react';

export type AdminTab =
  'overview' | 'aduan' | 'aspirasi' | 'kepuasan' | 'users-dewan' | 'users-moderator';

export interface AdminNavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'overview',
    label: 'Ringkasan Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'aduan',
    label: 'Aduan Masyarakat',
    icon: Megaphone,
    adminOnly: true,
  },
  {
    id: 'aspirasi',
    label: 'Aspirasi Dapil DPRD',
    icon: Landmark,
  },
  {
    id: 'kepuasan',
    label: 'Survei Kepuasan CSAT',
    icon: Star,
    adminOnly: true,
  },
];
