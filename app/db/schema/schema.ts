import { relations, sql } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// 1. Enums
// ---------------------------------------------------------------------------
export const userRoleEnum = pgEnum('user_role', ['admin', 'moderator', 'dprd', 'dpr']);
export const genderEnum = pgEnum('gender', ['male', 'female']);
export const regionTypeEnum = pgEnum('region_type', [
  'kabupaten',
  'kecamatan',
  'dapil_dprd',
  'dapil_dpr',
]);

// ---------------------------------------------------------------------------
// 2. Regions (Wilayah) Table
// ---------------------------------------------------------------------------
export const regions = pgTable('regions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  type: regionTypeEnum('type').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// 3. Users Table (Auth, Security & Core RBAC)
// ---------------------------------------------------------------------------
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').default('moderator').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('users_email_active_idx')
      .on(table.email)
      .where(sql`deleted_at IS NULL`),
  ]
);

// ---------------------------------------------------------------------------
// 4. User Profiles Table (Presentation, Slug, Region & Legislative Fields)
// ---------------------------------------------------------------------------
export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),

    fullName: text('full_name').notNull(),
    slug: text('slug').notNull(),
    gender: genderEnum('gender').notNull(),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),

    // Wilayah assignment (null for admin, set for moderator, dprd, dpr)
    regionId: uuid('region_id').references(() => regions.id, { onDelete: 'set null' }),

    // Legislative-specific metadata (DPRD & DPR only)
    party: text('party'),
    commission: text('commission'),
    position: text('position'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('user_profiles_slug_active_idx')
      .on(table.slug)
      .where(sql`deleted_at IS NULL`),
  ]
);

// ---------------------------------------------------------------------------
// 5. Relations
// ---------------------------------------------------------------------------
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
  region: one(regions, {
    fields: [userProfiles.regionId],
    references: [regions.id],
  }),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
  userProfiles: many(userProfiles),
}));

// ---------------------------------------------------------------------------
// 6. Inferred TypeScript Types
// ---------------------------------------------------------------------------
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type Gender = (typeof genderEnum.enumValues)[number];
export type RegionType = (typeof regionTypeEnum.enumValues)[number];

export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
