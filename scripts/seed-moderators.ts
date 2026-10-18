import { eq } from 'drizzle-orm';

import { regions, userProfiles, users } from '../app/db/schema/schema';
import { hashPassword } from '../app/lib/auth.server';
import { type ScriptDb, getScriptDb } from './db';

const MODERATORS_DATA = [
  {
    name: 'Moderator Dapil 1',
    email: 'moderator.dapil1@siwaday.tapinkab.go.id',
    dapilCode: 'DAPIL-TAPIN-1',
    gender: 'male' as const,
    slug: 'moderator-dapil-1',
  },
  {
    name: 'Moderator Dapil 2',
    email: 'moderator.dapil2@siwaday.tapinkab.go.id',
    dapilCode: 'DAPIL-TAPIN-2',
    gender: 'female' as const,
    slug: 'moderator-dapil-2',
  },
  {
    name: 'Moderator Dapil 3',
    email: 'moderator.dapil3@siwaday.tapinkab.go.id',
    dapilCode: 'DAPIL-TAPIN-3',
    gender: 'male' as const,
    slug: 'moderator-dapil-3',
  },
];

export async function seedModerators(context?: ScriptDb) {
  const ownContext = !context ? await getScriptDb() : null;
  const db = context?.db || ownContext!.db;

  try {
    console.log('🛡️ Seeding regional moderators...');
    const defaultPasswordHash = hashPassword('Moderator2026!');

    for (const mod of MODERATORS_DATA) {
      // Find region ID
      const [region] = await db
        .select()
        .from(regions)
        .where(eq(regions.code, mod.dapilCode))
        .limit(1);

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, mod.email))
        .limit(1);

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        await db
          .update(users)
          .set({ role: 'moderator', isActive: true, updatedAt: new Date() })
          .where(eq(users.id, userId));
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            email: mod.email,
            passwordHash: defaultPasswordHash,
            role: 'moderator',
            isActive: true,
          })
          .returning({ id: users.id });
        userId = newUser.id;
      }

      const [existingProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      if (existingProfile) {
        await db
          .update(userProfiles)
          .set({
            fullName: mod.name,
            slug: mod.slug,
            gender: mod.gender,
            avatarUrl: null,
            regionId: region?.id || null,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.id, existingProfile.id));
      } else {
        await db.insert(userProfiles).values({
          userId,
          fullName: mod.name,
          slug: mod.slug,
          gender: mod.gender,
          avatarUrl: null,
          regionId: region?.id || null,
        });
      }
    }
    console.log(`✅ Seeded ${MODERATORS_DATA.length} moderators.`);
  } finally {
    if (ownContext) {
      await ownContext.close();
    }
  }
}

// Allow direct execution
if (process.argv[1]?.includes('seed-moderators')) {
  seedModerators()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed moderators:', err);
      process.exit(1);
    });
}
