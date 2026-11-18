import { db } from '@/db/index.server';
import { type AuditAction, auditLogs } from '@/db/schema/schema';

import type { AuthUserPayload } from '@/lib/auth.server';

export interface CreateAuditLogParams {
  actor: AuthUserPayload;
  action: AuditAction;
  entityId: string;
  entityType?: string;
  targetName?: string;
  description: string;
  details?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    ip?: string;
    userAgent?: string;
    reason?: string;
    [key: string]: unknown;
  };
}

export async function createAuditLog({
  actor,
  action,
  entityId,
  entityType = 'user',
  targetName,
  description,
  details,
}: CreateAuditLogParams) {
  try {
    const [inserted] = await db
      .insert(auditLogs)
      .values({
        actorId: actor.id,
        actorName: actor.fullName,
        actorEmail: actor.email,
        actorRole: actor.role,
        action,
        entityType,
        entityId,
        targetName: targetName || null,
        description,
        details: details || null,
      })
      .returning();

    return inserted;
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
    return null;
  }
}
