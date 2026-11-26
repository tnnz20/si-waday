import { eq } from 'drizzle-orm';
import { db } from '~/db/index.server';
import { regions } from '~/db/schema/schema';

/**
 * Look up an active region UUID by exact region display name (e.g., "Dapil Tapin 1").
 * Returns null if the region does not exist in PostgreSQL.
 */
export async function resolveRegionIdByName(name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const [matched] = await db
    .select({ id: regions.id })
    .from(regions)
    .where(eq(regions.name, trimmed))
    .limit(1);

  return matched?.id ?? null;
}
