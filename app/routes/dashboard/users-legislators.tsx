import { db } from '@/db/index.server';
import { regions, userProfiles, users } from '@/db/schema/schema';
import { and, asc, eq, isNull, ne } from 'drizzle-orm';
import { redirect } from 'react-router';

import { createAuditLog } from '@/lib/audit.server';
import { hashPassword } from '@/lib/auth.server';
import { requireAuth } from '@/lib/session.server';

import { DewanTab, type LegislatorItem } from '@/components/dashboard/admin/dewan-tab';

import type { Route } from './+types/users-legislators';

export const meta: Route.MetaFunction = () => [
  { title: 'Manajemen Anggota Dewan • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content:
      'Direktori dan manajemen akun perwakilan rakyat DPRD Kabupaten Tapin dan DPR RI Dapil Kalsel 1.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);

  // Role guard: Only admin can access user management
  if (authResult.user.role !== 'admin') {
    throw redirect('/dashboard');
  }

  const rawUsers = await db
    .select({
      id: users.id,
      name: userProfiles.fullName,
      slug: userProfiles.slug,
      email: users.email,
      party: userProfiles.party,
      commission: userProfiles.commission,
      dapilName: regions.name,
      role: users.role,
      gender: userProfiles.gender,
      isActive: users.isActive,
      phone: userProfiles.phone,
      avatarUrl: userProfiles.avatarUrl,
      bio: userProfiles.bio,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .leftJoin(regions, eq(regions.id, userProfiles.regionId))
    .where(and(isNull(users.deletedAt), isNull(userProfiles.deletedAt)))
    .orderBy(asc(userProfiles.fullName));

  const legislators: LegislatorItem[] = rawUsers
    .filter((r) => r.role === 'dprd' || r.role === 'dpr')
    .map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      email: r.email,
      party: r.party || '-',
      commission: r.commission || '-',
      dapilName: r.dapilName || '-',
      role: r.role === 'dprd' ? 'DPRD Tapin' : 'DPR RI',
      gender: r.gender,
      isActive: r.isActive,
      phone: r.phone,
      avatarUrl: r.avatarUrl,
      bio: r.bio,
    }));

  const payload = {
    currentUser: authResult.user,
    legislators,
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

  // Get current target user data for audit snapshots
  const [targetUser] = await db
    .select({
      id: users.id,
      email: users.email,
      name: userProfiles.fullName,
      isActive: users.isActive,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    return Response.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
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
      description: `${nextStatus ? 'Mengaktifkan' : 'Menonaktifkan'} akun ${targetUser.name}`,
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
      description: `Mereset password akun ${targetUser.name} ke default sistem`,
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
      description: `Menghapus akun ${targetUser.name} (soft-delete)`,
    });

    return Response.json({ success: true, message: 'Akun pengguna berhasil dihapus.' });
  }

  // Intent: Update profile information
  if (intent === 'update-profile') {
    const fullName = (formData.get('fullName') as string)?.trim();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const gender = (formData.get('gender') as 'male' | 'female') || 'male';
    const phone = (formData.get('phone') as string)?.trim() || null;
    const party = (formData.get('party') as string)?.trim() || null;
    const commission = (formData.get('commission') as string)?.trim() || null;
    const dapilName = (formData.get('dapilName') as string)?.trim();

    if (!fullName || !email) {
      return Response.json({ error: 'Nama dan email wajib diisi.' }, { status: 400 });
    }

    // Check if email already claimed by another active user
    const [existingEmailUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email), ne(users.id, userId), isNull(users.deletedAt)))
      .limit(1);

    if (existingEmailUser) {
      return Response.json(
        { error: 'Alamat email sudah terdaftar dan digunakan oleh akun lain.' },
        { status: 400 }
      );
    }

    // Lookup region id if dapilName provided
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
        party,
        commission,
        ...(regionId ? { regionId } : {}),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId));

    await createAuditLog({
      actor: authResult.user,
      action: 'PROFILE_UPDATE',
      entityId: userId,
      targetName: fullName,
      description: `Memperbarui data profil anggota dewan ${fullName}`,
      details: {
        after: { fullName, email, phone, party, commission, dapilName },
      },
    });

    return Response.json({ success: true, message: 'Data profil berhasil diperbarui.' });
  }

  return Response.json({ error: 'Aksi tidak dikenali.' }, { status: 400 });
}

export default function LegislatorsPage({ loaderData }: Route.ComponentProps) {
  return <DewanTab legislators={loaderData.legislators} />;
}
