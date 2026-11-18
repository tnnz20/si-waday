import * as React from 'react';

import { Link } from 'react-router';

import { getInitials } from '@/lib/utils';

import { TablePagination } from '@/components/shared/table-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DAPIL_TAPIN_LIST } from '@/constants/tapin';

import {
  Eye,
  KeyRound,
  Mail,
  MoreHorizontal,
  Pencil,
  Power,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react';

import { DapilBadge } from './dapil-badge';
import {
  type BaseUserActionItem,
  CreateUserDialog,
  DeleteUserAlertDialog,
  EditUserDialog,
  ResetPasswordAlertDialog,
  ToggleStatusAlertDialog,
} from './user-action-dialogs';

export interface ModeratorItem {
  id: string;
  name: string;
  slug: string;
  email: string;
  dapilName: string;
  role: string;
  gender: string;
  isActive: boolean;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

interface ModeratorsTabProps {
  moderators: ModeratorItem[];
  searchQuery?: string;
}

const PAGE_SIZE = 10;

export function ModeratorsTab({ moderators, searchQuery }: ModeratorsTabProps) {
  const [internalSearch, setInternalSearch] = React.useState('');
  const effectiveSearch = searchQuery ?? internalSearch;
  const [filterDapil, setFilterDapil] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Dialog State
  const [selectedUser, setSelectedUser] = React.useState<BaseUserActionItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = React.useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Reset page when filter changes (adjusting state during render)
  const [prevFilterKey, setPrevFilterKey] = React.useState(`${effectiveSearch}-${filterDapil}`);
  const currentFilterKey = `${effectiveSearch}-${filterDapil}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  const filtered = React.useMemo(() => {
    return moderators.filter((m) => {
      // Dapil filter
      if (filterDapil !== 'all' && m.dapilName !== filterDapil) return false;

      // Search query
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchEmail = m.email.toLowerCase().includes(q);
        const matchDapil = m.dapilName.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchDapil) return false;
      }

      return true;
    });
  }, [moderators, effectiveSearch, filterDapil]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const activeCount = moderators.filter((m) => m.isActive).length;

  return (
    <div className="animate-in fade-in space-y-6 duration-200 sm:space-y-8">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Total Moderator Regional
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{moderators.length}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">Petugas verifikasi usulan per Dapil</p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Cakupan Wilayah
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">3 Dapil</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">12 Kecamatan se-Kabupaten Tapin</p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Akun Aktif
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-600">
                  {activeCount} / {moderators.length}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <span className="text-sm font-black">24/7</span>
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">Moderasi tiket dan aduan warga</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-warm-200 overflow-hidden rounded-3xl bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-darknavy-900 text-lg font-black sm:text-xl">
                Daftar Moderator Regional Dapil
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 sm:text-sm">
                Petugas verifikator yang bertugas memvalidasi usulan dan aduan di setiap daerah
                pemilihan
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Quick Search */}
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari nama, email, dapil..."
                  value={effectiveSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  className="border-warm-300 text-darknavy-900 focus-visible:border-accent-500 focus-visible:ring-accent-500/20 bg-warm-50/70 h-10 w-full rounded-2xl py-2 pr-4 pl-9 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 sm:text-sm"
                />
              </div>

              {/* Add Moderator Button */}
              <Button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="bg-accent-500 hover:bg-accent-600 h-10 rounded-2xl text-xs font-bold text-white shadow-xs sm:text-sm"
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                <span>Tambah Moderator</span>
              </Button>
            </div>
          </div>

          {/* Dapil Filter */}
          <div className="border-warm-200/80 mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Filter Wilayah:</span>
            <div className="w-[220px]">
              <Select value={filterDapil} onValueChange={setFilterDapil}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Dapil" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Dapil (1-3)</SelectItem>
                  {DAPIL_TAPIN_LIST.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-warm-200 bg-warm-50/60 border-y text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-extrabold tracking-wider">Moderator</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Alamat Email</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Wilayah Tugas Dapil</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-warm-200/80 divide-y">
                {paginatedItems.map((mod) => (
                  <tr key={mod.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-blue-800">
                          {getInitials(mod.name)}
                        </div>
                        <div>
                          <Link
                            to={`/dashboard/users/moderators/${mod.slug}`}
                            className="text-darknavy-900 hover:text-accent-600 block text-sm font-extrabold transition-colors"
                          >
                            {mod.name}
                          </Link>
                          <p className="text-2xs text-slate-500 capitalize">
                            {mod.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 font-medium text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{mod.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <DapilBadge dapil={mod.dapilName} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {mod.isActive ? (
                        <span className="text-2xs inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 font-extrabold text-emerald-800">
                          ● Aktif
                        </span>
                      ) : (
                        <span className="text-2xs inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-500">
                          ○ Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="hover:bg-warm-100 h-8 w-8 rounded-xl text-slate-500"
                            aria-label={`Menu aksi untuk ${mod.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl">
                          <DropdownMenuLabel>Aksi Moderator</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/dashboard/users/moderators/${mod.slug}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4 text-slate-500" />
                              <span>Lihat Detail</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(mod);
                              setIsEditDialogOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                            <span>Edit Profil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(mod);
                              setIsResetPassOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <KeyRound className="h-4 w-4 text-amber-500" />
                            <span>Reset Password</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(mod);
                              setIsStatusDialogOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Power className="h-4 w-4 text-slate-600" />
                            <span>{mod.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(mod);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="flex items-center gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Hapus Pengguna</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Tidak ditemukan moderator dengan kriteria filter tersebut.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        roleType="moderator"
      />

      {/* Action Dialogs */}
      <EditUserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }}
        isLegislator={false}
      />

      <ResetPasswordAlertDialog
        user={selectedUser}
        isOpen={isResetPassOpen}
        onClose={() => {
          setIsResetPassOpen(false);
          setSelectedUser(null);
        }}
      />

      <ToggleStatusAlertDialog
        user={selectedUser}
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setSelectedUser(null);
        }}
      />

      <DeleteUserAlertDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
