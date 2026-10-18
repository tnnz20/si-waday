import { eq } from 'drizzle-orm';

import { userProfiles, users } from '../app/db/schema/schema';
import { hashPassword } from '../app/lib/auth.server';
import { getScriptDb } from './db';

export async function seedAdmin() {
  const { db, client } = getScriptDb();

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@siwaday.tapinkab.go.id';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrator Si-Waday';

    console.log(`🌱 Seeding Super Admin account (${adminEmail})...`);

    const passwordHash = hashPassword(adminPassword);

    // Check if admin user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    let userId: string;

    if (existingUser) {
      console.log(`ℹ️ Admin user already exists (ID: ${existingUser.id}), updating credentials...`);
      userId = existingUser.id;
      await db
        .update(users)
        .set({
          passwordHash,
          role: 'admin',
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      console.log(`➕ Creating new admin user record...`);
      const [newUser] = await db
        .insert(users)
        .values({
          email: adminEmail,
          passwordHash,
          role: 'admin',
          isActive: true,
        })
        .returning({ id: users.id });
      userId = newUser.id;
    }

    // Check or update user profile
    const [existingProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      await db
        .update(userProfiles)
        .set({
          fullName: adminName,
          slug: 'admin',
          gender: 'male',
          regionId: null,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.id, existingProfile.id));
    } else {
      await db.insert(userProfiles).values({
        userId,
        fullName: adminName,
        slug: 'admin',
        gender: 'male',
        regionId: null,
      });
    }

    console.log(`✅ Super Admin seeded successfully: ${adminEmail}`);
  } finally {
    await client.end();
  }
}

// Allow direct execution
if (process.argv[1]?.includes('seed-admin')) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed admin:', err);
      process.exit(1);
    });
}
