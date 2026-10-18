import * as React from 'react';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';

import { Landmark, Search, ShieldCheck, Users } from 'lucide-react';

export interface LegislatorItem {
  id: string;
  name: string;
  party: string;
  commission: string;
  dapilName: string;
  role: string;
  gender: string;
  isActive: boolean;
}

interface DewanTabProps {
  legislators: LegislatorItem[];
}

function getInitials(name: string): string {
  const clean = name.replace(/^(H\.|Dr\.|Hj\.|Drs\.|Ir\.|M\.)\s*/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'DW';
}

export function DewanTab({ legislators }: DewanTabProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterRole, setFilterRole] = React.useState<'all' | 'DPRD Tapin' | 'DPR RI'>('all');

  const filtered = React.useMemo(() => {
    return legislators.filter((item) => {
      const matchRole = filterRole === 'all' || item.role === filterRole;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(query) ||
        item.party.toLowerCase().includes(query) ||
        item.commission.toLowerCase().includes(query) ||
        item.dapilName.toLowerCase().includes(query);
      return matchRole && matchSearch;
    });
  }, [legislators, searchQuery, filterRole]);

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
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
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

            {/* Filter Pills */}
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
                Semua ({legislators.length})
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
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama anggota dewan, partai politik, komisi, atau dapil..."
              className="border-warm-200 bg-warm-50 h-10 pl-10 text-xs sm:text-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-warm-200 bg-warm-50/60 border-y text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-extrabold tracking-wider">Anggota Dewan</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Partai</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Tingkat & Dapil</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Komisi</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-warm-200/80 divide-y">
                {filtered.map((rep) => (
                  <tr key={rep.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-800">
                          {getInitials(rep.name)}
                        </div>
                        <div>
                          <p className="text-darknavy-900 text-sm font-extrabold">{rep.name}</p>
                          <p className="text-2xs text-slate-500 capitalize">
                            {rep.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-50 font-bold text-emerald-800"
                      >
                        {rep.party}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-darknavy-900 font-bold">{rep.role}</p>
                      <p className="text-2xs text-slate-500">{rep.dapilName}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-700">{rep.commission}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-2xs inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 font-extrabold text-emerald-800">
                        ● Aktif
                      </span>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Tidak ditemukan anggota dewan dengan kata kunci pencarian tersebut.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
