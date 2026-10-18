import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { getInitials } from '~/lib/utils';

import { Mail, Shield, ShieldCheck } from 'lucide-react';

export interface ModeratorItem {
  id: string;
  name: string;
  email: string;
  dapilName: string;
  gender: string;
  isActive: boolean;
}

interface ModeratorsTabProps {
  moderators: ModeratorItem[];
  searchQuery?: string;
}

export function ModeratorsTab({ moderators, searchQuery = '' }: ModeratorsTabProps) {
  const filtered = React.useMemo(() => {
    return moderators.filter((m) => {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.dapilName.toLowerCase().includes(q)
      );
    });
  }, [moderators, searchQuery]);

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
                  Cakupan Wilayah Dapil
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">3 Wilayah</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">
              Dapil Tapin 1, Dapil Tapin 2, Dapil Tapin 3
            </p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Status Operasional
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-600">100% Aktif</p>
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
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
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
                </tr>
              </thead>
              <tbody className="divide-warm-200/80 divide-y">
                {filtered.map((mod) => (
                  <tr key={mod.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-blue-800">
                          {getInitials(mod.name)}
                        </div>
                        <div>
                          <p className="text-darknavy-900 text-sm font-extrabold">{mod.name}</p>
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
                      <span className="border-warm-300 bg-warm-100 text-darknavy-900 rounded-md border px-2 py-0.5 font-bold">
                        {mod.dapilName}
                      </span>
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
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      Tidak ditemukan moderator dengan kata kunci pencarian tersebut.
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
