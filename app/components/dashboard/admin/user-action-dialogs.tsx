import * as React from 'react';

import { createUserSchema, updateUserSchema } from '@/schema/user';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';

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
  const prevFetcherState = React.useRef(fetcher.state);

  const [cachedUser, setCachedUser] = React.useState(user);
  if (user && user !== cachedUser) {
    setCachedUser(user);
  }
  const activeUser = user ?? cachedUser;

  const serverFieldErrors = (fetcher.data as { fieldErrors?: Record<string, string> } | undefined)
    ?.fieldErrors;
  const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({});
  const [clearedServerFields, setClearedServerFields] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (prevFetcherState.current !== 'idle' && fetcher.state === 'idle' && fetcher.data) {
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
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, onClose]);

  // Clean up pointer-events on body when dialog closes (Radix DropdownMenu + Dialog bugfix)
  React.useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, [isOpen]);

  if (!activeUser) return null;

  const handleFieldChange = (field: string) => {
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverFieldErrors?.[field] && !clearedServerFields[field]) {
      setClearedServerFields((prev) => ({ ...prev, [field]: true }));
    }
  };

  const getFieldError = (field: string): string | undefined => {
    if (clientErrors[field]) return clientErrors[field];
    if (clearedServerFields[field]) return undefined;
    return serverFieldErrors?.[field];
  };

  const fullNameError = getFieldError('fullName');
  const emailError = getFieldError('email');
  const genderError = getFieldError('gender');
  const phoneError = getFieldError('phone');
  const partyError = getFieldError('party');
  const commissionError = getFieldError('commission');
  const dapilNameError = getFieldError('dapilName');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClearedServerFields({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    const parsedData = {
      userId: String(formData.get('userId') || activeUser.id),
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      gender: String(formData.get('gender') || 'male'),
      phone: formData.get('phone') ? String(formData.get('phone')) : '',
      party: formData.get('party') ? String(formData.get('party')) : '',
      commission: formData.get('commission') ? String(formData.get('commission')) : '',
      dapilName: formData.get('dapilName') ? String(formData.get('dapilName')) : '',
    };

    const result = updateUserSchema.safeParse(parsedData);
    if (!result.success) {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }
      setClientErrors(newErrors);
      return;
    }

    setClientErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-darknavy-900 text-lg font-black sm:text-xl">
            Edit Data Pengguna
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 sm:text-sm">
            Perbarui informasi profil untuk akun {activeUser.name} ({activeUser.email}).
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form
          key={isOpen ? activeUser.id : 'closed'}
          method="post"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4 pt-2"
        >
          <input type="hidden" name="intent" value="update-profile" />
          <input type="hidden" name="userId" value={activeUser.id} />

          {(fetcher.data as { error?: string })?.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {(fetcher.data as { error?: string }).error}
            </div>
          ) : null}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="edit-fullName" className="text-xs font-bold text-slate-700">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <Input
              id="edit-fullName"
              name="fullName"
              defaultValue={activeUser.name}
              placeholder="Masukkan nama lengkap"
              onInput={() => handleFieldChange('fullName')}
              aria-invalid={fullNameError ? 'true' : 'false'}
              aria-describedby={fullNameError ? 'edit-fullName-error' : undefined}
              className={cn(
                'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                fullNameError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
              )}
            />
            {fullNameError ? (
              <p id="edit-fullName-error" className="text-2xs font-semibold text-rose-500">
                {fullNameError}
              </p>
            ) : null}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="edit-email" className="text-xs font-bold text-slate-700">
              Alamat Email <span className="text-rose-500">*</span>
            </label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              defaultValue={activeUser.email}
              placeholder="email@tapinkab.go.id"
              onInput={() => handleFieldChange('email')}
              aria-invalid={emailError ? 'true' : 'false'}
              aria-describedby={emailError ? 'edit-email-error' : undefined}
              className={cn(
                'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                emailError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
              )}
            />
            {emailError ? (
              <p id="edit-email-error" className="text-2xs font-semibold text-rose-500">
                {emailError}
              </p>
            ) : null}
          </div>

          {/* Gender & Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="edit-gender" className="text-xs font-bold text-slate-700">
                Jenis Kelamin
              </label>
              <Select
                name="gender"
                defaultValue={activeUser.gender || 'male'}
                onValueChange={() => handleFieldChange('gender')}
              >
                <SelectTrigger
                  id="edit-gender"
                  className="border-warm-300 rounded-xl bg-white text-xs"
                >
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {genderError ? (
                <p id="edit-gender-error" className="text-2xs font-semibold text-rose-500">
                  {genderError}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-phone" className="text-xs font-bold text-slate-700">
                Nomor Telepon / WhatsApp
              </label>
              <Input
                id="edit-phone"
                name="phone"
                defaultValue={activeUser.phone || ''}
                placeholder="08xxxxxxxxxx"
                onInput={() => handleFieldChange('phone')}
                aria-invalid={phoneError ? 'true' : 'false'}
                aria-describedby={phoneError ? 'edit-phone-error' : undefined}
                className={cn(
                  'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                  phoneError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                )}
              />
              {phoneError ? (
                <p id="edit-phone-error" className="text-2xs font-semibold text-rose-500">
                  {phoneError}
                </p>
              ) : null}
            </div>
          </div>

          {/* Legislator-specific fields: Party & Commission */}
          {isLegislator ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="edit-party" className="text-xs font-bold text-slate-700">
                  Partai Politik
                </label>
                <Input
                  id="edit-party"
                  name="party"
                  defaultValue={activeUser.party || ''}
                  placeholder="Contoh: Partai Golkar"
                  onInput={() => handleFieldChange('party')}
                  aria-invalid={partyError ? 'true' : 'false'}
                  aria-describedby={partyError ? 'edit-party-error' : undefined}
                  className={cn(
                    'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                    partyError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  )}
                />
                {partyError ? (
                  <p id="edit-party-error" className="text-2xs font-semibold text-rose-500">
                    {partyError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="edit-commission" className="text-xs font-bold text-slate-700">
                  Komisi / Bidang
                </label>
                <Input
                  id="edit-commission"
                  name="commission"
                  defaultValue={activeUser.commission || ''}
                  placeholder="Contoh: Komisi I"
                  onInput={() => handleFieldChange('commission')}
                  aria-invalid={commissionError ? 'true' : 'false'}
                  aria-describedby={commissionError ? 'edit-commission-error' : undefined}
                  className={cn(
                    'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                    commissionError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  )}
                />
                {commissionError ? (
                  <p id="edit-commission-error" className="text-2xs font-semibold text-rose-500">
                    {commissionError}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Dapil Assignment */}
          <div className="space-y-1.5">
            <label htmlFor="edit-dapilName" className="text-xs font-bold text-slate-700">
              Wilayah / Daerah Pemilihan (Dapil)
            </label>
            <Select
              name="dapilName"
              defaultValue={activeUser.dapilName || 'Dapil Tapin 1'}
              onValueChange={() => handleFieldChange('dapilName')}
            >
              <SelectTrigger
                id="edit-dapilName"
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
                    DPR RI (Dapil Kalsel 1)
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
            {dapilNameError ? (
              <p id="edit-dapilName-error" className="text-2xs font-semibold text-rose-500">
                {dapilNameError}
              </p>
            ) : null}
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
  const prevFetcherState = React.useRef(fetcher.state);

  const [cachedUser, setCachedUser] = React.useState(user);
  if (user && user !== cachedUser) {
    setCachedUser(user);
  }
  const activeUser = user ?? cachedUser;

  React.useEffect(() => {
    if (prevFetcherState.current !== 'idle' && fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Password berhasil direset ke default.',
        });
        onClose();
      }
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, onClose]);

  // Clean up pointer-events on body when dialog closes (Radix DropdownMenu + Dialog bugfix)
  React.useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, [isOpen]);

  if (!activeUser) return null;

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
            <strong className="text-darknavy-900 font-bold">{activeUser.name}</strong> (
            {activeUser.email})? Password akan diatur ulang ke password default sistem yang
            dikonfigurasi pada server.
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
            <input type="hidden" name="userId" value={activeUser.id} />
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
  const prevFetcherState = React.useRef(fetcher.state);

  const [cachedUser, setCachedUser] = React.useState(user);
  if (user && user !== cachedUser) {
    setCachedUser(user);
  }
  const activeUser = user ?? cachedUser;

  React.useEffect(() => {
    if (prevFetcherState.current !== 'idle' && fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Status akun berhasil diperbarui.',
        });
        onClose();
      }
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, onClose]);

  // Clean up pointer-events on body when dialog closes (Radix DropdownMenu + Dialog bugfix)
  React.useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, [isOpen]);

  if (!activeUser) return null;

  const willActivate = !activeUser.isActive;

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
                Akun <strong className="text-darknavy-900 font-bold">{activeUser.name}</strong> akan
                diaktifkan kembali dan dapat login mengakses sistem SI-WADAY.
              </>
            ) : (
              <>
                Akun <strong className="text-darknavy-900 font-bold">{activeUser.name}</strong> akan
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
            <input type="hidden" name="userId" value={activeUser.id} />
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
  const prevFetcherState = React.useRef(fetcher.state);

  const [cachedUser, setCachedUser] = React.useState(user);
  if (user && user !== cachedUser) {
    setCachedUser(user);
  }
  const activeUser = user ?? cachedUser;

  React.useEffect(() => {
    if (prevFetcherState.current !== 'idle' && fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { success?: boolean; message?: string; error?: string };
      if (data.error) {
        toast.error('Gagal Menyimpan Data', { description: data.error });
      } else if (data.success) {
        toast.success('Berhasil', {
          description: data.message || 'Akun berhasil dihapus.',
        });
        onClose();
      }
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, onClose]);

  // Clean up pointer-events on body when dialog closes (Radix DropdownMenu + Dialog bugfix)
  React.useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, [isOpen]);

  if (!activeUser) return null;

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
            <strong className="text-darknavy-900 font-bold">{activeUser.name}</strong> (
            {activeUser.email})? Akun ini akan dinonaktifkan secara permanen (*soft delete*) dan
            riwayat tindakannya tetap tersimpan dalam audit log.
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
            <input type="hidden" name="userId" value={activeUser.id} />
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
  const prevFetcherState = React.useRef(fetcher.state);

  const [selectedRole, setSelectedRole] = React.useState<'dprd' | 'dpr'>('dprd');

  const serverFieldErrors = (fetcher.data as { fieldErrors?: Record<string, string> } | undefined)
    ?.fieldErrors;
  const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({});
  const [clearedServerFields, setClearedServerFields] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (prevFetcherState.current !== 'idle' && fetcher.state === 'idle' && fetcher.data) {
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
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, onClose]);

  // Clean up pointer-events on body when dialog closes (Radix DropdownMenu + Dialog bugfix)
  React.useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, [isOpen]);

  const handleFieldChange = (field: string) => {
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverFieldErrors?.[field] && !clearedServerFields[field]) {
      setClearedServerFields((prev) => ({ ...prev, [field]: true }));
    }
  };

  const getFieldError = (field: string): string | undefined => {
    if (clientErrors[field]) return clientErrors[field];
    if (clearedServerFields[field]) return undefined;
    return serverFieldErrors?.[field];
  };

  const fullNameError = getFieldError('fullName');
  const emailError = getFieldError('email');
  const roleError = getFieldError('role');
  const dapilNameError = getFieldError('dapilName');
  const partyError = getFieldError('party');
  const commissionError = getFieldError('commission');
  const genderError = getFieldError('gender');
  const phoneError = getFieldError('phone');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClearedServerFields({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    const parsedData = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      role: String(formData.get('role') || (isLegislator ? selectedRole : 'moderator')),
      dapilName: String(formData.get('dapilName') || ''),
      gender: String(formData.get('gender') || 'male'),
      phone: formData.get('phone') ? String(formData.get('phone')) : '',
      party: formData.get('party') ? String(formData.get('party')) : '',
      commission: formData.get('commission') ? String(formData.get('commission')) : '',
    };

    const result = createUserSchema.safeParse(parsedData);
    if (!result.success) {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }
      setClientErrors(newErrors);
      return;
    }

    setClientErrors({});
  };

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

        <fetcher.Form
          key={isOpen ? 'open' : 'closed'}
          method="post"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4 pt-2"
        >
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
              onInput={() => handleFieldChange('fullName')}
              aria-invalid={fullNameError ? 'true' : 'false'}
              aria-describedby={fullNameError ? 'create-fullName-error' : undefined}
              className={cn(
                'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                fullNameError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
              )}
            />
            {fullNameError ? (
              <p id="create-fullName-error" className="text-2xs font-semibold text-rose-500">
                {fullNameError}
              </p>
            ) : null}
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
              onInput={() => handleFieldChange('email')}
              aria-invalid={emailError ? 'true' : 'false'}
              aria-describedby={emailError ? 'create-email-error' : undefined}
              className={cn(
                'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                emailError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
              )}
            />
            {emailError ? (
              <p id="create-email-error" className="text-2xs font-semibold text-rose-500">
                {emailError}
              </p>
            ) : null}
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
                onValueChange={(val) => {
                  setSelectedRole(val as 'dprd' | 'dpr');
                  handleFieldChange('role');
                }}
              >
                <SelectTrigger
                  id="create-role"
                  className={cn(
                    'border-warm-300 rounded-xl bg-white text-xs',
                    roleError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  )}
                >
                  <SelectValue placeholder="Pilih Lembaga" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="dprd">DPRD Kabupaten Tapin</SelectItem>
                  <SelectItem value="dpr">DPR RI (Dapil Kalsel 1)</SelectItem>
                </SelectContent>
              </Select>
              {roleError ? (
                <p id="create-role-error" className="text-2xs font-semibold text-rose-500">
                  {roleError}
                </p>
              ) : null}
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
              onValueChange={() => handleFieldChange('dapilName')}
            >
              <SelectTrigger
                id="create-dapil"
                className={cn(
                  'border-warm-300 rounded-xl bg-white text-xs',
                  dapilNameError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                )}
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
            {dapilNameError ? (
              <p id="create-dapil-error" className="text-2xs font-semibold text-rose-500">
                {dapilNameError}
              </p>
            ) : null}
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
                  onInput={() => handleFieldChange('party')}
                  aria-invalid={partyError ? 'true' : 'false'}
                  aria-describedby={partyError ? 'create-party-error' : undefined}
                  className={cn(
                    'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                    partyError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  )}
                />
                {partyError ? (
                  <p id="create-party-error" className="text-2xs font-semibold text-rose-500">
                    {partyError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="create-commission" className="text-xs font-bold text-slate-700">
                  Komisi / Bidang
                </label>
                <Input
                  id="create-commission"
                  name="commission"
                  placeholder="Contoh: Komisi I"
                  onInput={() => handleFieldChange('commission')}
                  aria-invalid={commissionError ? 'true' : 'false'}
                  aria-describedby={commissionError ? 'create-commission-error' : undefined}
                  className={cn(
                    'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                    commissionError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  )}
                />
                {commissionError ? (
                  <p id="create-commission-error" className="text-2xs font-semibold text-rose-500">
                    {commissionError}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Gender & Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="create-gender" className="text-xs font-bold text-slate-700">
                Jenis Kelamin
              </label>
              <Select
                name="gender"
                defaultValue="male"
                onValueChange={() => handleFieldChange('gender')}
              >
                <SelectTrigger
                  id="create-gender"
                  className={cn(
                    'border-warm-300 rounded-xl bg-white text-xs',
                    genderError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  )}
                >
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {genderError ? (
                <p id="create-gender-error" className="text-2xs font-semibold text-rose-500">
                  {genderError}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="create-phone" className="text-xs font-bold text-slate-700">
                Nomor Telepon / WA
              </label>
              <Input
                id="create-phone"
                name="phone"
                placeholder="08xxxxxxxxxx"
                onInput={() => handleFieldChange('phone')}
                aria-invalid={phoneError ? 'true' : 'false'}
                aria-describedby={phoneError ? 'create-phone-error' : undefined}
                className={cn(
                  'border-warm-300 rounded-xl bg-white text-xs sm:text-sm',
                  phoneError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                )}
              />
              {phoneError ? (
                <p id="create-phone-error" className="text-2xs font-semibold text-rose-500">
                  {phoneError}
                </p>
              ) : null}
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
