import * as React from 'react';

import { useFetcher } from 'react-router';
import { toast } from 'sonner';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Info,
  KeyRound,
  LoaderCircle,
  Power,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
} from 'lucide-react';

export interface BaseUserActionItem {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  dapilName: string;
  isActive: boolean;
  party?: string;
  commission?: string;
  phone?: string | null;
}

// ---------------------------------------------------------------------------
// 1. Edit User Modal Dialog
// ---------------------------------------------------------------------------
interface EditUserDialogProps {
  user: BaseUserActionItem | null;
  isOpen: boolean;
  onClose: () => void;
  isLegislator?: boolean;
}

export function EditUserDialog({
  user,
  isOpen,
  onClose,
  isLegislator = false,
}: EditUserDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  React.useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Data profil berhasil diperbarui.',
        });
        onClose();
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-darknavy-900 text-lg font-black sm:text-xl">
            Edit Data Pengguna
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 sm:text-sm">
            Perbarui informasi profil untuk akun {user.name} ({user.email}).
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4 pt-2">
          <input type="hidden" name="intent" value="update-profile" />
          <input type="hidden" name="userId" value={user.id} />

          {(fetcher.data as { error?: string })?.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {(fetcher.data as { error?: string }).error}
            </div>
          ) : null}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-bold text-slate-700">
              Nama Lengkap
            </label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={user.name}
              placeholder="Masukkan nama lengkap"
              required
              className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-700">
              Alamat Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="email@tapinkab.go.id"
              required
              className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
            />
          </div>

          {/* Gender & Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="gender" className="text-xs font-bold text-slate-700">
                Jenis Kelamin
              </label>
              <Select name="gender" defaultValue={user.gender || 'male'}>
                <SelectTrigger id="gender" className="border-warm-300 rounded-xl bg-white text-xs">
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-slate-700">
                Nomor Telepon / WhatsApp
              </label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone || ''}
                placeholder="08xxxxxxxxxx"
                className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Legislator-specific fields: Party & Commission */}
          {isLegislator ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="party" className="text-xs font-bold text-slate-700">
                  Partai Politik
                </label>
                <Input
                  id="party"
                  name="party"
                  defaultValue={user.party || ''}
                  placeholder="Contoh: Partai Golkar"
                  className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="commission" className="text-xs font-bold text-slate-700">
                  Komisi / Bidang
                </label>
                <Input
                  id="commission"
                  name="commission"
                  defaultValue={user.commission || ''}
                  placeholder="Contoh: Komisi I"
                  className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
                />
              </div>
            </div>
          ) : null}

          {/* Dapil Assignment */}
          <div className="space-y-1.5">
            <label htmlFor="dapilName" className="text-xs font-bold text-slate-700">
              Wilayah / Daerah Pemilihan (Dapil)
            </label>
            <Select name="dapilName" defaultValue={user.dapilName || 'Dapil Tapin 1'}>
              <SelectTrigger id="dapilName" className="border-warm-300 rounded-xl bg-white text-xs">
                <SelectValue placeholder="Pilih Dapil" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {DAPIL_TAPIN_LIST.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name} ({d.seats})
                  </SelectItem>
                ))}
                {isLegislator ? (
                  <SelectItem value="Dapil Kalimantan Selatan I">
                    DPR RI (Dapil Kalsel 1)
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-warm-200 rounded-xl text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent-500 hover:bg-accent-600 rounded-xl text-xs font-bold text-white shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// 2. Reset Password Alert Dialog (Default Password from .env)
// ---------------------------------------------------------------------------
interface ResetPasswordAlertDialogProps {
  user: BaseUserActionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordAlertDialog({ user, isOpen, onClose }: ResetPasswordAlertDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  React.useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Data profil berhasil diperbarui.',
        });
        onClose();
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-md">
        <AlertDialogHeader className="space-y-2 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <KeyRound className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-darknavy-900 text-lg font-black">
            Konfirmasi Reset Password Pengguna
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500 sm:text-sm">
            Apakah Anda yakin ingin mengatur ulang kata sandi untuk akun{' '}
            <strong className="text-darknavy-900 font-bold">{user.name}</strong> ({user.email})?
            Password akan diatur ulang ke password default sistem yang dikonfigurasi pada server.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={isSubmitting}
            onClick={onClose}
            className="border-warm-200 rounded-xl text-xs font-bold"
          >
            Batal
          </AlertDialogCancel>
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="reset-password" />
            <input type="hidden" name="userId" value={user.id} />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-amber-600 text-xs font-bold text-white hover:bg-amber-700 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Mereset...
                </>
              ) : (
                <>
                  <KeyRound className="mr-1.5 h-4 w-4" />
                  Ya, Reset Password
                </>
              )}
            </Button>
          </fetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// 3. Toggle Status Alert Dialog (Active / Inactive)
// ---------------------------------------------------------------------------
interface ToggleStatusAlertDialogProps {
  user: BaseUserActionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ToggleStatusAlertDialog({ user, isOpen, onClose }: ToggleStatusAlertDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  React.useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Data profil berhasil diperbarui.',
        });
        onClose();
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!user) return null;

  const willActivate = !user.isActive;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-md">
        <AlertDialogHeader className="space-y-2 text-left">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              willActivate ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Power className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-darknavy-900 text-lg font-black">
            {willActivate ? 'Aktifkan Akun Pengguna' : 'Nonaktifkan Akun Pengguna'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500 sm:text-sm">
            {willActivate ? (
              <>
                Akun <strong className="text-darknavy-900 font-bold">{user.name}</strong> akan
                diaktifkan kembali dan dapat login mengakses sistem SI-WADAY.
              </>
            ) : (
              <>
                Akun <strong className="text-darknavy-900 font-bold">{user.name}</strong> akan
                dinonaktifkan sementara. Pengguna tidak akan dapat login ke dashboard sampai akun
                diaktifkan kembali.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={isSubmitting}
            onClick={onClose}
            className="border-warm-200 rounded-xl text-xs font-bold"
          >
            Batal
          </AlertDialogCancel>
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="toggle-status" />
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="nextStatus" value={String(willActivate)} />
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl text-xs font-bold text-white sm:w-auto ${
                willActivate
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Memproses...
                </>
              ) : willActivate ? (
                <>
                  <UserCheck className="mr-1.5 h-4 w-4" />
                  Aktifkan Akun
                </>
              ) : (
                <>
                  <UserX className="mr-1.5 h-4 w-4" />
                  Nonaktifkan Akun
                </>
              )}
            </Button>
          </fetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// 4. Delete User Alert Dialog (Soft Delete)
// ---------------------------------------------------------------------------
interface DeleteUserAlertDialogProps {
  user: BaseUserActionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserAlertDialog({ user, isOpen, onClose }: DeleteUserAlertDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  React.useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Data profil berhasil diperbarui.',
        });
        onClose();
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-md">
        <AlertDialogHeader className="space-y-2 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
            <Trash2 className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-darknavy-900 text-lg font-black">
            Konfirmasi Hapus Akun Pengguna
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500 sm:text-sm">
            Apakah Anda yakin ingin menghapus akun{' '}
            <strong className="text-darknavy-900 font-bold">{user.name}</strong> ({user.email})?
            Akun ini akan dinonaktifkan secara permanen (*soft delete*) dan riwayat tindakannya
            tetap tersimpan dalam audit log.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={isSubmitting}
            onClick={onClose}
            className="border-warm-200 rounded-xl text-xs font-bold"
          >
            Batal
          </AlertDialogCancel>
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="delete-user" />
            <input type="hidden" name="userId" value={user.id} />
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Ya, Hapus Akun
                </>
              )}
            </Button>
          </fetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// 5. Create User Modal Dialog (Legislator & Moderator)
// ---------------------------------------------------------------------------
export interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleType: 'legislator' | 'moderator';
}

export function CreateUserDialog({ isOpen, onClose, roleType }: CreateUserDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  const isLegislator = roleType === 'legislator';

  const [selectedRole, setSelectedRole] = React.useState<'dprd' | 'dpr'>('dprd');

  React.useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menambahkan Akun', { description: data.error });
      } else if (data.success) {
        toast.success('Akun Berhasil Dibuat', {
          description: data.message || 'Pengguna baru berhasil ditambahkan.',
        });
        onClose();
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <UserPlus className="h-5 w-5" />
          </div>
          <DialogTitle className="text-darknavy-900 text-lg font-black sm:text-xl">
            {isLegislator ? 'Tambah Anggota Dewan Baru' : 'Tambah Moderator Regional Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 sm:text-sm">
            {isLegislator
              ? 'Daftarkan profil perwakilan rakyat DPRD Kabupaten Tapin atau DPR RI ke sistem.'
              : 'Daftarkan akun petugas verifikator wilayah per daerah pemilihan (Dapil).'}
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4 pt-2">
          <input type="hidden" name="intent" value="create-user" />

          {(fetcher.data as { error?: string })?.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {(fetcher.data as { error?: string }).error}
            </div>
          ) : null}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="create-fullName" className="text-xs font-bold text-slate-700">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <Input
              id="create-fullName"
              name="fullName"
              placeholder={isLegislator ? 'Contoh: H. Paijan, S.E.' : 'Contoh: Ahmad Fadilah'}
              required
              className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="create-email" className="text-xs font-bold text-slate-700">
              Alamat Email <span className="text-rose-500">*</span>
            </label>
            <Input
              id="create-email"
              name="email"
              type="email"
              placeholder={isLegislator ? 'nama@dprd.tapinkab.go.id' : 'moderator@tapinkab.go.id'}
              required
              className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
            />
          </div>

          {/* Legislator role selection (DPRD vs DPR RI) */}
          {isLegislator ? (
            <div className="space-y-1.5">
              <label htmlFor="create-role" className="text-xs font-bold text-slate-700">
                Tingkat Lembaga Perwakilan <span className="text-rose-500">*</span>
              </label>
              <Select
                name="role"
                defaultValue="dprd"
                onValueChange={(val) => setSelectedRole(val as 'dprd' | 'dpr')}
              >
                <SelectTrigger
                  id="create-role"
                  className="border-warm-300 rounded-xl bg-white text-xs"
                >
                  <SelectValue placeholder="Pilih Lembaga" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="dprd">DPRD Kabupaten Tapin</SelectItem>
                  <SelectItem value="dpr">DPR RI (Dapil Kalsel 1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <input type="hidden" name="role" value="moderator" />
          )}

          {/* Dapil selection */}
          <div className="space-y-1.5">
            <label htmlFor="create-dapil" className="text-xs font-bold text-slate-700">
              Daerah Pemilihan (Dapil) <span className="text-rose-500">*</span>
            </label>
            <Select
              name="dapilName"
              defaultValue={
                isLegislator && selectedRole === 'dpr'
                  ? 'Dapil Kalimantan Selatan I'
                  : 'Dapil Tapin 1'
              }
            >
              <SelectTrigger
                id="create-dapil"
                className="border-warm-300 rounded-xl bg-white text-xs"
              >
                <SelectValue placeholder="Pilih Dapil" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {DAPIL_TAPIN_LIST.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name} ({d.seats})
                  </SelectItem>
                ))}
                {isLegislator ? (
                  <SelectItem value="Dapil Kalimantan Selatan I">
                    DPR RI (Dapil Kalimantan Selatan I)
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          {/* Legislator: Party & Commission */}
          {isLegislator ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="create-party" className="text-xs font-bold text-slate-700">
                  Partai Politik
                </label>
                <Input
                  id="create-party"
                  name="party"
                  placeholder="Contoh: Partai Golkar"
                  className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="create-commission" className="text-xs font-bold text-slate-700">
                  Komisi / Bidang
                </label>
                <Input
                  id="create-commission"
                  name="commission"
                  placeholder="Contoh: Komisi I"
                  className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
                />
              </div>
            </div>
          ) : null}

          {/* Gender & Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="create-gender" className="text-xs font-bold text-slate-700">
                Jenis Kelamin
              </label>
              <Select name="gender" defaultValue="male">
                <SelectTrigger
                  id="create-gender"
                  className="border-warm-300 rounded-xl bg-white text-xs"
                >
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="create-phone" className="text-xs font-bold text-slate-700">
                Nomor Telepon / WA
              </label>
              <Input
                id="create-phone"
                name="phone"
                placeholder="08xxxxxxxxxx"
                className="border-warm-300 rounded-xl bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Password info notice */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              Password akun akan otomatis diatur menggunakan default sistem. Pengguna atau admin
              dapat mereset atau memperbarui kata sandi sewaktu-waktu.
            </p>
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-warm-200 rounded-xl text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent-500 hover:bg-accent-600 rounded-xl text-xs font-bold text-white shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Buat Akun'
              )}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
