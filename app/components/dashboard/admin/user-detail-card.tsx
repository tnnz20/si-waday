import * as React from 'react';

import { Link, useFetcher } from 'react-router';

import { getInitials } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  History,
  KeyRound,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Power,
  Trash2,
  UserCheck,
} from 'lucide-react';

import { DapilBadge } from './dapil-badge';
import { PartyBadge } from './party-badge';
import {
  type BaseUserActionItem,
  DeleteUserAlertDialog,
  EditUserDialog,
  ResetPasswordAlertDialog,
  ToggleStatusAlertDialog,
} from './user-action-dialogs';

export interface UserDetailData {
  id: string;
  name: string;
  slug: string;
  email: string;
  role: string;
  gender: string;
  dapilName: string;
  isActive: boolean;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  party?: string | null;
  commission?: string | null;
  createdAt: string | Date;
  lastLoginAt?: string | Date | null;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  description: string;
  details?: Record<string, unknown> | null;
  createdAt: string | Date;
}

interface UserDetailCardProps {
  user: UserDetailData;
  auditLogs: AuditLogItem[];
  isLegislator?: boolean;
  backHref: string;
  backLabel: string;
}

export function UserDetailCard({
  user,
  auditLogs,
  isLegislator = false,
  backHref,
  backLabel,
}: UserDetailCardProps) {
  const uploadFetcher = useFetcher();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = React.useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Client-side preview with memory leak protection (AGENTS.md Rule #6)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Auto submit to server action
    const formData = new FormData();
    formData.append('intent', 'upload-avatar');
    formData.append('userId', user.id);
    formData.append('avatar', file);
    uploadFetcher.submit(formData, { method: 'post', encType: 'multipart/form-data' });
  };

  const actionItem: BaseUserActionItem = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    dapilName: user.dapilName,
    isActive: user.isActive,
    party: user.party || undefined,
    commission: user.commission || undefined,
    phone: user.phone || undefined,
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'Belum pernah login';
    const d = new Date(date);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const isUploading = uploadFetcher.state === 'submitting';

  return (
    <div className="animate-in fade-in space-y-6 duration-200">
      {/* Back Button & Breadcrumb Top Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Button
          asChild
          variant="outline"
          className="border-warm-200 text-darknavy-900 hover:bg-warm-100 w-fit gap-2 rounded-2xl text-xs font-bold shadow-2xs sm:text-sm"
        >
          <Link to={backHref}>
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>
        </Button>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="border-warm-200 text-darknavy-900 hover:bg-warm-100 gap-1.5 rounded-xl text-xs font-bold"
          >
            <Pencil className="h-3.5 w-3.5 text-blue-500" />
            <span>Edit Profil</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsResetPassOpen(true)}
            className="border-warm-200 text-darknavy-900 hover:bg-warm-100 gap-1.5 rounded-xl text-xs font-bold"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-500" />
            <span>Reset Password</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsStatusDialogOpen(true)}
            className="border-warm-200 text-darknavy-900 hover:bg-warm-100 gap-1.5 rounded-xl text-xs font-bold"
          >
            <Power className="h-3.5 w-3.5 text-slate-600" />
            <span>{user.isActive ? 'Nonaktifkan' : 'Aktifkan'}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="gap-1.5 rounded-xl border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus Akun</span>
          </Button>
        </div>
      </div>

      {/* Main Bento Profile Card */}
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Avatar & Upload Trigger */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="border-warm-200 h-24 w-24 rounded-3xl border-2 shadow-md sm:h-28 sm:w-28">
                  <AvatarImage
                    src={previewUrl || user.avatarUrl || undefined}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-3xl bg-linear-to-tr to-amber-500 text-xl font-black text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Upload Button Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-accent-500 hover:bg-accent-600 text-darknavy-900 absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center rounded-2xl text-white shadow-md transition-transform hover:scale-105 disabled:opacity-50"
                  aria-label="Unggah foto profil"
                >
                  {isUploading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <span className="text-2xs text-center text-slate-400">
                Maks 2 MB (JPG, PNG, WebP)
              </span>
            </div>

            {/* Profile Identitas & Badges */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="border-darknavy-700 bg-darknavy-900 rounded-full px-3 py-0.5 text-xs font-black text-white uppercase"
                >
                  {user.role}
                </Badge>

                {user.isActive ? (
                  <span className="text-2xs inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 font-extrabold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Akun Aktif
                  </span>
                ) : (
                  <span className="text-2xs inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-0.5 font-bold text-slate-500">
                    ○ Akun Nonaktif
                  </span>
                )}

                <DapilBadge dapil={user.dapilName} />

                {user.party ? <PartyBadge party={user.party} /> : null}
              </div>

              <h1 className="text-darknavy-900 text-2xl font-black tracking-tight sm:text-3xl">
                {user.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
                {user.phone ? (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                  <span>{user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
              </div>

              {user.commission ? (
                <div className="border-warm-200/80 bg-warm-50/70 mt-3 inline-block rounded-2xl border px-3.5 py-2 text-xs font-semibold text-slate-700">
                  <span className="text-2xs block font-bold text-slate-400 uppercase">
                    Penugasan Komisi / Bidang:
                  </span>
                  {user.commission}
                </div>
              ) : null}
            </div>
          </div>

          {/* Timestamps Grid */}
          <div className="border-warm-200 mt-6 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="border-warm-200 bg-warm-50 flex h-10 w-10 items-center justify-center rounded-xl border text-slate-500">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xs font-extrabold text-slate-400 uppercase">Terdaftar Pada</p>
                <p className="text-darknavy-900 text-xs font-bold sm:text-sm">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="border-warm-200 bg-warm-50 flex h-10 w-10 items-center justify-center rounded-xl border text-slate-500">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xs font-extrabold text-slate-400 uppercase">Login Terakhir</p>
                <p className="text-darknavy-900 text-xs font-bold sm:text-sm">
                  {formatDate(user.lastLoginAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Timeline Card */}
      <Card className="border-warm-200 rounded-3xl bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <History className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                Riwayat Aktivitas & Audit Akun
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Jejak digital perubahan profil, status operasional, dan reset password
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          {auditLogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">
              Belum ada riwayat aktivitas yang tercatat untuk akun ini.
            </div>
          ) : (
            <div className="relative space-y-4 border-l-2 border-slate-200 pl-4 sm:space-y-6 sm:pl-6">
              {auditLogs.map((log) => (
                <div key={log.id} className="relative">
                  {/* Dot on timeline */}
                  <div className="border-accent-500 bg-warm-100 absolute top-1.5 -left-[21px] h-3 w-3 rounded-full border-2 sm:-left-[29px]" />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-2xs rounded-md font-bold uppercase">
                        {log.action}
                      </Badge>
                      <span className="text-2xs text-slate-400">{formatDate(log.createdAt)}</span>
                    </div>

                    <p className="text-darknavy-900 text-xs font-bold sm:text-sm">
                      {log.description}
                    </p>

                    <p className="text-2xs text-slate-500">
                      Oleh:{' '}
                      <strong className="text-slate-700">
                        {log.actorName} ({log.actorRole})
                      </strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <EditUserDialog
        user={actionItem}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        isLegislator={isLegislator}
      />

      <ResetPasswordAlertDialog
        user={actionItem}
        isOpen={isResetPassOpen}
        onClose={() => setIsResetPassOpen(false)}
      />

      <ToggleStatusAlertDialog
        user={actionItem}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
      />

      <DeleteUserAlertDialog
        user={actionItem}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
