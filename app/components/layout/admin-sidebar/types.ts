import type * as React from 'react';

import { Landmark, LayoutDashboard, Megaphone, Star } from 'lucide-react';

export type AdminTab = 'overview' | 'aduan' | 'aspirasi' | 'kepuasan';

export interface AdminNavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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
  },
];
