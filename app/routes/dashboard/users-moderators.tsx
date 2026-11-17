import { db } from '@/db/index.server';
import { regions, userProfiles, users } from '@/db/schema/schema';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { redirect } from 'react-router';

import { requireAuth } from '@/lib/session.server';

import { type ModeratorItem, ModeratorsTab } from '@/components/dashboard/admin/moderators-tab';

import type { Route } from './+types/users-moderators';

export const meta: Route.MetaFunction = () => [
  { title: 'Manajemen Moderator Regional • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Daftar akun verifikator regional per daerah pemilihan (Dapil) Kabupaten Tapin.',
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
      email: users.email,
      dapilName: regions.name,
      role: users.role,
      gender: userProfiles.gender,
      isActive: users.isActive,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .leftJoin(regions, eq(regions.id, userProfiles.regionId))
    .where(and(isNull(users.deletedAt), isNull(userProfiles.deletedAt)))
    .orderBy(asc(userProfiles.fullName));

  const moderators: ModeratorItem[] = rawUsers
    .filter((r) => r.role === 'moderator')
    .map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      dapilName: r.dapilName || '-',
      gender: r.gender,
      isActive: r.isActive,
    }));

  const payload = {
    currentUser: authResult.user,
    moderators,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export default function ModeratorsPage({ loaderData }: Route.ComponentProps) {
  return <ModeratorsTab moderators={loaderData.moderators} />;
}
