import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

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
// 5. Audit Action Enum & Audit Logs Table
// ---------------------------------------------------------------------------
export const auditActionEnum = pgEnum('audit_action', [
  'USER_LOGIN',
  'USER_LOGOUT',
  'STATUS_CHANGE',
  'PASSWORD_RESET',
  'PROFILE_UPDATE',
  'AVATAR_UPLOAD',
  'USER_DELETE',
  'USER_RESTORE',
]);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    actorName: text('actor_name').notNull(),
    actorEmail: text('actor_email').notNull(),
    actorRole: text('actor_role').notNull(),
    action: auditActionEnum('action').notNull(),
    entityType: text('entity_type').notNull().default('user'),
    entityId: text('entity_id').notNull(),
    targetName: text('target_name'),
    description: text('description').notNull(),
    details: jsonb('details').$type<{
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
      ip?: string;
      userAgent?: string;
      reason?: string;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('audit_logs_actor_idx').on(table.actorId),
    index('audit_logs_entity_idx').on(table.entityType, table.entityId),
    index('audit_logs_created_at_idx').on(table.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// 6. Relations
// ---------------------------------------------------------------------------
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  auditLogs: many(auditLogs),
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

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
  }),
}));

// ---------------------------------------------------------------------------
// 7. Inferred TypeScript Types
// ---------------------------------------------------------------------------
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type Gender = (typeof genderEnum.enumValues)[number];
export type RegionType = (typeof regionTypeEnum.enumValues)[number];
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
