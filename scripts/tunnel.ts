import net from 'node:net';
import { Client } from 'ssh2';

export interface TunnelConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  privateKey?: string;
  dbHost: string;
  dbPort: number;
}

export interface Tunnel {
  localPort: number;
  close: () => Promise<void>;
}

/**
 * Creates a local loopback TCP port forward through an SSH tunnel.
 */
export async function createTunnel(config: TunnelConfig): Promise<Tunnel> {
  const sshClient = new Client();

  await new Promise<void>((resolve, reject) => {
    sshClient
      .on('ready', () => resolve())
      .on('error', (err) => reject(new Error(`SSH connection failed: ${err.message}`)))
      .connect({
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        privateKey: config.privateKey,
        readyTimeout: 15000,
      });
  });

  const server = net.createServer((localSocket) => {
    sshClient.forwardOut(
      '127.0.0.1',
      localSocket.remotePort ?? 0,
      config.dbHost,
      config.dbPort,
      (err, stream) => {
        if (err) {
          localSocket.destroy();
          return;
        }
        localSocket.pipe(stream).pipe(localSocket);
      }
    );
  });

  const localPort = await new Promise<number>((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (typeof addr === 'object' && addr !== null) {
        resolve(addr.port);
      } else {
        reject(new Error('Failed to bind local loopback port for SSH tunnel'));
      }
    });
    server.on('error', reject);
  });

  return {
    localPort,
    close: async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      sshClient.end();
    },
  };
}
