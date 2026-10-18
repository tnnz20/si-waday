import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../app/db/schema/schema';
import { type Tunnel, createTunnel } from './tunnel';

export type ScriptDb = {
  db: ReturnType<typeof drizzle<typeof schema>>;
  client: postgres.Sql;
  tunnel: Tunnel | null;
  close: () => Promise<void>;
};

export async function getScriptDb(): Promise<ScriptDb> {
  const isSSH = process.argv.includes('--ssh');
  let tunnel: Tunnel | null = null;

  let host = process.env.POSTGRES_HOST || 'localhost';
  let port = Number(process.env.POSTGRES_PORT || 5432);
  let user = process.env.POSTGRES_USER || 'postgres';
  let password = process.env.POSTGRES_PASSWORD || 'postgres';
  let database = process.env.POSTGRES_DB || 'si_waday';
  let ssl: boolean | 'require' | 'allow' | 'prefer' | 'verify-full' = false;

  if (isSSH) {
    console.log('🔒 Connecting via SSH tunnel...');
    const sshHost = process.env.SSH_HOST;
    const sshPort = Number(process.env.SSH_PORT || 22);
    const sshUser = process.env.SSH_USER;
    const sshPassword = process.env.SSH_PASSWORD;

    if (!sshHost || !sshUser) {
      throw new Error('SSH_HOST and SSH_USER are required when using --ssh');
    }

    const remoteDbHost = process.env.SSH_POSTGRES_HOST || '127.0.0.1';
    const remoteDbPort = Number(process.env.SSH_POSTGRES_PORT || 5432);

    tunnel = await createTunnel({
      host: sshHost,
      port: sshPort,
      user: sshUser,
      password: sshPassword,
      dbHost: remoteDbHost,
      dbPort: remoteDbPort,
    });

    console.log(`✅ SSH Tunnel established! Forwarding via local port ${tunnel.localPort}`);

    host = '127.0.0.1';
    port = tunnel.localPort;
    user = process.env.SSH_POSTGRES_USER || user;
    password = process.env.SSH_POSTGRES_PASSWORD || password;
    database = process.env.SSH_POSTGRES_DATABASE || database;
    if (process.env.SSH_POSTGRES_SSLMODE === 'require') {
      ssl = 'require';
    }
  } else {
    console.log(`🐘 Connecting to PostgreSQL at ${host}:${port}/${database}...`);
  }

  const client = postgres({
    host,
    port,
    user,
    pass: password,
    database,
    ssl,
    max: 1,
  });

  const db = drizzle(client, { schema });

  const close = async () => {
    await client.end();
    if (tunnel) {
      await tunnel.close();
      console.log('🔒 SSH tunnel closed.');
    }
  };

  return { db, client, tunnel, close };
}
