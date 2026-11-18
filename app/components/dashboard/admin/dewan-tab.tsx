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

import {
  Eye,
  KeyRound,
  Landmark,
  MoreHorizontal,
  Pencil,
  Power,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';

import { DapilBadge } from './dapil-badge';
import { PartyBadge } from './party-badge';
import {
  type BaseUserActionItem,
  CreateUserDialog,
  DeleteUserAlertDialog,
  EditUserDialog,
  ResetPasswordAlertDialog,
  ToggleStatusAlertDialog,
} from './user-action-dialogs';

export interface LegislatorItem {
  id: string;
  name: string;
  slug: string;
  email: string;
  party: string;
  commission: string;
  dapilName: string;
  role: string;
  gender: string;
  isActive: boolean;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

interface DewanTabProps {
  legislators: LegislatorItem[];
  searchQuery?: string;
}

const PAGE_SIZE = 10;

export function DewanTab({ legislators, searchQuery }: DewanTabProps) {
  const [internalSearch, setInternalSearch] = React.useState('');
  const effectiveSearch = searchQuery ?? internalSearch;

  // Multi-dimensional filters
  const [filterRole, setFilterRole] = React.useState<'all' | 'DPRD Tapin' | 'DPR RI'>('all');
  const [filterParty, setFilterParty] = React.useState<string>('all');
  const [filterCommission, setFilterCommission] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Dialog State
  const [selectedUser, setSelectedUser] = React.useState<BaseUserActionItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = React.useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Distinct party and commission lists
  const partyList = React.useMemo(() => {
    return Array.from(new Set(legislators.map((l) => l.party).filter(Boolean))).sort();
  }, [legislators]);

  const commissionList = React.useMemo(() => {
    return Array.from(new Set(legislators.map((l) => l.commission).filter(Boolean))).sort();
  }, [legislators]);

  // Reset page when filter changes (adjusting state during render)
  const [prevFilterKey, setPrevFilterKey] = React.useState(
    `${effectiveSearch}-${filterRole}-${filterParty}-${filterCommission}`
  );
  const currentFilterKey = `${effectiveSearch}-${filterRole}-${filterParty}-${filterCommission}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  const filtered = React.useMemo(() => {
    return legislators.filter((item) => {
      // Role filter
      if (filterRole !== 'all' && item.role !== filterRole) return false;

      // Party filter
      if (filterParty !== 'all' && item.party !== filterParty) return false;

      // Commission filter
      if (filterCommission !== 'all' && item.commission !== filterCommission) return false;

      // Search query
      if (effectiveSearch.trim()) {
        const query = effectiveSearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchParty = item.party.toLowerCase().includes(query);
        const matchCommission = item.commission.toLowerCase().includes(query);
        const matchDapil = item.dapilName.toLowerCase().includes(query);
        if (!matchName && !matchParty && !matchCommission && !matchDapil) return false;
      }

      return true;
    });
  }, [legislators, effectiveSearch, filterRole, filterParty, filterCommission]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const countDprd = legislators.filter((l) => l.role === 'DPRD Tapin').length;
  const countDpr = legislators.filter((l) => l.role === 'DPR RI').length;

  return (
    <div className="animate-in fade-in space-y-6 duration-200 sm:space-y-8">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Total Anggota Dewan
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{legislators.length}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">Terdaftar dalam database aktif</p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  DPRD Kab. Tapin
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{countDprd}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Landmark className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">3 Daerah Pemilihan (Dapil 1, 2, 3)</p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  DPR RI (Kalsel 1)
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{countDpr}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">Perwakilan DPR RI Dapil Kalsel 1</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-warm-200 overflow-hidden rounded-3xl bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-darknavy-900 text-lg font-black sm:text-xl">
                Daftar Anggota Dewan Perwakilan Rakyat
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 sm:text-sm">
                Kelola data perwakilan rakyat legislatif Kabupaten Tapin dan DPR RI
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Quick Search */}
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari dewan, partai, dapil..."
                  value={effectiveSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  className="border-warm-300 text-darknavy-900 focus-visible:border-accent-500 focus-visible:ring-accent-500/20 bg-warm-50/70 h-10 w-full rounded-2xl py-2 pr-4 pl-9 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 sm:text-sm"
                />
              </div>

              {/* Add Legislator Button */}
              <Button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="bg-accent-500 hover:bg-accent-600 h-10 rounded-2xl text-xs font-bold text-white shadow-xs sm:text-sm"
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                <span>Tambah Dewan</span>
              </Button>
            </div>
          </div>

          {/* Multi-Dimensional Filter Bar */}
          <div className="border-warm-200/80 mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
            {/* Filter Tingkat: DPRD Tapin vs DPR RI */}
            <div className="border-warm-200 bg-warm-50 text-2xs inline-flex rounded-xl border p-1">
              <button
                type="button"
                onClick={() => setFilterRole('all')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                  filterRole === 'all'
                    ? 'bg-darknavy-900 text-white shadow-xs'
                    : 'hover:text-darknavy-900 text-slate-600'
                }`}
              >
                Semua Tingkat ({legislators.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterRole('DPRD Tapin')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                  filterRole === 'DPRD Tapin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'hover:text-darknavy-900 text-slate-600'
                }`}
              >
                DPRD Tapin ({countDprd})
              </button>
              <button
                type="button"
                onClick={() => setFilterRole('DPR RI')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                  filterRole === 'DPR RI'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:text-darknavy-900 text-slate-600'
                }`}
              >
                DPR RI ({countDpr})
              </button>
            </div>

            {/* Filter Partai */}
            <div className="w-[180px]">
              <Select value={filterParty} onValueChange={setFilterParty}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Partai" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  <SelectItem value="all">Semua Partai</SelectItem>
                  {partyList.map((party) => (
                    <SelectItem key={party} value={party}>
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Komisi */}
            <div className="w-[220px]">
              <Select value={filterCommission} onValueChange={setFilterCommission}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Komisi" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  <SelectItem value="all">Semua Komisi</SelectItem>
                  {commissionList.map((comm) => (
                    <SelectItem key={comm} value={comm}>
                      {comm}
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
                  <th className="px-6 py-3 font-extrabold tracking-wider">Anggota Dewan</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Tingkat</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Partai</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Dapil</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Komisi</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-warm-200/80 divide-y">
                {paginatedItems.map((rep) => (
                  <tr key={rep.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-800">
                          {getInitials(rep.name)}
                        </div>
                        <div>
                          <Link
                            to={`/dashboard/users/legislators/${rep.slug}`}
                            className="text-darknavy-900 hover:text-accent-600 block text-sm font-extrabold transition-colors"
                          >
                            {rep.name}
                          </Link>
                          <p className="text-2xs text-slate-500 capitalize">
                            {rep.gender === 'male' ? 'Laki-laki' : 'Perempuan'} • {rep.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-2xs inline-flex items-center rounded-lg px-2.5 py-1 font-bold ${
                          rep.role === 'DPRD Tapin'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-blue-200 bg-blue-50 text-blue-800'
                        }`}
                      >
                        {rep.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <PartyBadge party={rep.party} />
                    </td>
                    <td className="px-4 py-3.5">
                      <DapilBadge dapil={rep.dapilName} />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-700">{rep.commission}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {rep.isActive ? (
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
                            aria-label={`Menu aksi untuk ${rep.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl">
                          <DropdownMenuLabel>Aksi Anggota</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/dashboard/users/legislators/${rep.slug}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4 text-slate-500" />
                              <span>Lihat Detail</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedUser(rep);
                              setIsEditDialogOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                            <span>Edit Profil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedUser(rep);
                              setIsResetPassOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <KeyRound className="h-4 w-4 text-amber-500" />
                            <span>Reset Password</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedUser(rep);
                              setIsStatusDialogOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Power className="h-4 w-4 text-slate-600" />
                            <span>{rep.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedUser(rep);
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
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Tidak ditemukan anggota dewan dengan kriteria filter tersebut.
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

      {/* Action Dialogs */}
      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        roleType="legislator"
      />

      <EditUserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }}
        isLegislator={true}
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
