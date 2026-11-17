import { db } from '@/db/index.server';
import { regions, userProfiles, users } from '@/db/schema/schema';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { redirect } from 'react-router';

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
      email: users.email,
      party: userProfiles.party,
      commission: userProfiles.commission,
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

  const legislators: LegislatorItem[] = rawUsers
    .filter((r) => r.role === 'dprd' || r.role === 'dpr')
    .map((r) => ({
      id: r.id,
      name: r.name,
      party: r.party || '-',
      commission: r.commission || '-',
      dapilName: r.dapilName || '-',
      role: r.role === 'dprd' ? 'DPRD Tapin' : 'DPR RI',
      gender: r.gender,
      isActive: r.isActive,
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

export default function LegislatorsPage({ loaderData }: Route.ComponentProps) {
  return <DewanTab legislators={loaderData.legislators} />;
}
