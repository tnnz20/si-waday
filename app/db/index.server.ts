import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema/schema';

declare global {
  var __postgresClient: postgres.Sql | undefined;
}

const client =
  globalThis.__postgresClient ??
  postgres({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    user: process.env.POSTGRES_USER || 'postgres',
    pass: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'si_waday',
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__postgresClient = client;
}

export const db = drizzle(client, { schema });
