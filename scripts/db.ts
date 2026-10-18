import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../app/db/schema/schema';

export function getScriptDb() {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = Number(process.env.POSTGRES_PORT || 5432);
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const database = process.env.POSTGRES_DB || 'si_waday';

  const client = postgres({
    host,
    port,
    user,
    pass: password,
    database,
    max: 1,
  });

  const db = drizzle(client, { schema });
  return { db, client };
}
