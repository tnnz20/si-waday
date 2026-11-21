import { db } from '@/db/index.server';
import { auditLogs, regions, userProfiles, users } from '@/db/schema/schema';
import { updateUserSchema } from '@/schema/user';
import { and, desc, eq, isNull, ne } from 'drizzle-orm';
import { redirect } from 'react-router';

import { createAuditLog } from '@/lib/audit.server';
import { hashPassword } from '@/lib/auth.server';
import { requireAuth } from '@/lib/session.server';
import { saveAvatarFile } from '@/lib/upload.server';

import {
  type AuditLogItem,
  UserDetailCard,
  type UserDetailData,
} from '@/components/dashboard/admin/user-detail-card';

import type { Route } from './+types/users-moderators-detail';

export const meta: Route.MetaFunction = () => [
  { title: 'Detail Profil Moderator Regional • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Detail informasi profil, verifikator wilayah, dan riwayat audit moderator regional.',
  },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);

  if (authResult.user.role !== 'admin') {
    throw redirect('/dashboard');
  }

  const slug = params.slug;
  if (!slug) {
    throw redirect('/dashboard/users/moderators');
  }

  const [rawUser] = await db
    .select({
      id: users.id,
      name: userProfiles.fullName,
      slug: userProfiles.slug,
      email: users.email,
      dapilName: regions.name,
      role: users.role,
      gender: userProfiles.gender,
      isActive: users.isActive,
      phone: userProfiles.phone,
      avatarUrl: userProfiles.avatarUrl,
      bio: userProfiles.bio,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .leftJoin(regions, eq(regions.id, userProfiles.regionId))
    .where(
      and(eq(userProfiles.slug, slug), isNull(users.deletedAt), isNull(userProfiles.deletedAt))
    )
    .limit(1);

  if (!rawUser || rawUser.role !== 'moderator') {
    throw redirect('/dashboard/users/moderators');
  }

  // Fetch recent audit logs for this user entity
  const rawAuditLogs = await db
    .select({
      id: auditLogs.id,
      actorName: auditLogs.actorName,
      actorRole: auditLogs.actorRole,
      action: auditLogs.action,
      description: auditLogs.description,
      details: auditLogs.details,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.entityId, rawUser.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(30);

  const user: UserDetailData = {
    id: rawUser.id,
    name: rawUser.name,
    slug: rawUser.slug,
    email: rawUser.email,
    role: 'Moderator Regional',
    gender: rawUser.gender,
    dapilName: rawUser.dapilName || '-',
    isActive: rawUser.isActive,
    phone: rawUser.phone,
    avatarUrl: rawUser.avatarUrl,
    bio: rawUser.bio,
    createdAt: rawUser.createdAt,
    lastLoginAt: rawUser.lastLoginAt,
  };

  const formattedAuditLogs: AuditLogItem[] = rawAuditLogs.map((log) => ({
    id: log.id,
    actorName: log.actorName,
    actorRole: log.actorRole,
    action: log.action,
    description: log.description,
    details: (log.details as Record<string, unknown>) || null,
    createdAt: log.createdAt,
  }));

  const payload = {
    currentUser: authResult.user,
    user,
    auditLogs: formattedAuditLogs,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export async function action({ request }: Route.ActionArgs) {
  const authResult = await requireAuth(request);
  if (authResult.user.role !== 'admin') {
    return Response.json({ error: 'Akses ditolak.' }, { status: 403 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent');
  const userId = formData.get('userId') as string;

  if (!userId) {
    return Response.json({ error: 'ID Pengguna tidak valid.' }, { status: 400 });
  }

  const [targetUser] = await db
    .select({
      id: users.id,
      email: users.email,
      name: userProfiles.fullName,
      isActive: users.isActive,
      avatarUrl: userProfiles.avatarUrl,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    return Response.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
  }

  // Intent: Upload Avatar Image
  if (intent === 'upload-avatar') {
    const avatarFile = formData.get('avatar') as File;
    const uploadResult = await saveAvatarFile(avatarFile);

    if (!uploadResult.success || !uploadResult.url) {
      return Response.json(
        { error: uploadResult.error || 'Gagal mengunggah foto profil.' },
        { status: 400 }
      );
    }

    await db
      .update(userProfiles)
      .set({ avatarUrl: uploadResult.url, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId));

    await createAuditLog({
      actor: authResult.user,
      action: 'AVATAR_UPLOAD',
      entityId: userId,
      targetName: targetUser.name,
      description: `Mengunggah foto profil baru untuk moderator ${targetUser.name}`,
      details: {
        avatarUrl: uploadResult.url,
      },
    });

    return Response.json({
      success: true,
      message: 'Foto profil berhasil diperbarui.',
      avatarUrl: uploadResult.url,
    });
  }

  // Intent: Toggle active status
  if (intent === 'toggle-status') {
    const nextStatus = formData.get('nextStatus') === 'true';
    await db
      .update(users)
      .set({ isActive: nextStatus, updatedAt: new Date() })
      .where(eq(users.id, userId));

    await createAuditLog({
      actor: authResult.user,
      action: 'STATUS_CHANGE',
      entityId: userId,
      targetName: targetUser.name,
      description: `${nextStatus ? 'Mengaktifkan' : 'Menonaktifkan'} akun moderator ${targetUser.name}`,
      details: {
        before: { isActive: targetUser.isActive },
        after: { isActive: nextStatus },
      },
    });

    return Response.json({ success: true, message: 'Status akun berhasil diperbarui.' });
  }

  // Intent: Reset password to default from .env (fail-closed without fallback)
  if (intent === 'reset-password') {
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD;
    if (!defaultPassword || !defaultPassword.trim()) {
      return Response.json(
        {
          error:
            'Gagal mereset password: DEFAULT_USER_PASSWORD belum dikonfigurasi pada file environment server (.env).',
        },
        { status: 500 }
      );
    }

    const passwordHash = hashPassword(defaultPassword);
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId));

    await createAuditLog({
      actor: authResult.user,
      action: 'PASSWORD_RESET',
      entityId: userId,
      targetName: targetUser.name,
      description: `Mereset password akun moderator ${targetUser.name} ke default sistem`,
    });

    return Response.json({
      success: true,
      message: 'Password akun berhasil di-reset ke default sistem.',
    });
  }

  // Intent: Soft-delete user
  if (intent === 'delete-user') {
    const now = new Date();
    await db
      .update(users)
      .set({ deletedAt: now, isActive: false, updatedAt: now })
      .where(eq(users.id, userId));
    await db
      .update(userProfiles)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(userProfiles.userId, userId));

    await createAuditLog({
      actor: authResult.user,
      action: 'USER_DELETE',
      entityId: userId,
      targetName: targetUser.name,
      description: `Menghapus akun moderator ${targetUser.name} (soft-delete)`,
    });

    return redirect('/dashboard/users/moderators');
  }

  // Intent: Update profile information
  if (intent === 'update-profile') {
    const validation = updateUserSchema.safeParse({
      userId,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      gender: formData.get('gender') || 'male',
      phone: formData.get('phone') || '',
      dapilName: formData.get('dapilName') || '',
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return Response.json(
        { error: 'Mohon periksa kembali isian formulir Anda.', fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email: rawEmail, gender, phone, dapilName } = validation.data;
    const email = rawEmail.toLowerCase();

    // Check if email already claimed by another active user
    const [existingEmailUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email), ne(users.id, userId), isNull(users.deletedAt)))
      .limit(1);

    if (existingEmailUser) {
      return Response.json(
        {
          error: 'Alamat email sudah terdaftar dan digunakan oleh akun lain.',
          fieldErrors: {
            email: 'Alamat email sudah terdaftar dan digunakan oleh akun lain.',
          },
        },
        { status: 400 }
      );
    }

    let regionId: string | null = null;
    if (dapilName) {
      const [matchedRegion] = await db
        .select({ id: regions.id })
        .from(regions)
        .where(eq(regions.name, dapilName))
        .limit(1);
      if (matchedRegion) regionId = matchedRegion.id;
    }

    await db.update(users).set({ email, updatedAt: new Date() }).where(eq(users.id, userId));
    await db
      .update(userProfiles)
      .set({
        fullName,
        gender,
        phone,
        ...(regionId ? { regionId } : {}),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId));

    await createAuditLog({
      actor: authResult.user,
      action: 'PROFILE_UPDATE',
      entityId: userId,
      targetName: fullName,
      description: `Memperbarui data profil moderator ${fullName}`,
      details: {
        after: { fullName, email, phone, dapilName },
      },
    });

    return Response.json({ success: true, message: 'Data profil berhasil diperbarui.' });
  }

  return Response.json({ error: 'Aksi tidak dikenali.' }, { status: 400 });
}

export default function ModeratorDetailPage({ loaderData }: Route.ComponentProps) {
  return (
    <UserDetailCard
      user={loaderData.user}
      auditLogs={loaderData.auditLogs}
      isLegislator={false}
      backHref="/dashboard/users/moderators"
      backLabel="Kembali ke Daftar Verifikator"
    />
  );
}
