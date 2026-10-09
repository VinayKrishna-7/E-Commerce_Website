const net = require('net');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

let embeddedInstance = null;

/**
 * Checks whether a TCP port is open.
 */
function isPortOpen(port, host = '127.0.0.1', timeout = 1200) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      status = true;
      socket.end();
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.once('close', () => {
      resolve(status);
    });

    socket.connect(port, host);
  });
}

/**
 * Ensures PostgreSQL is running and database `shopease` exists.
 */
async function ensureDatabaseReady() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/shopease';
  const urlObj = new URL(dbUrl);
  const host = urlObj.hostname || '127.0.0.1';
  const port = parseInt(urlObj.port || '5432', 10);
  const dbName = urlObj.pathname.replace(/^\//, '').split('?')[0] || 'shopease';
  const user = urlObj.username || 'postgres';
  const password = urlObj.password || 'postgres';

  const alreadyRunning = await isPortOpen(port, host);

  if (alreadyRunning) {
    console.log(`[Database] PostgreSQL is actively running on ${host}:${port}.`);
  } else {
    console.log(`[Database] No PostgreSQL detected on port ${port}. Initializing embedded PostgreSQL...`);
    try {
      const EmbeddedPostgres = require('embedded-postgres').default || require('embedded-postgres');
      const pgDataDir = path.resolve(__dirname, '../../pgdata');

      if (!fs.existsSync(pgDataDir)) {
        fs.mkdirSync(pgDataDir, { recursive: true });
      }

      embeddedInstance = new EmbeddedPostgres({
        port,
        databaseDir: pgDataDir,
        user,
        password,
      });

      console.log(`[Database] Starting embedded PostgreSQL server in ${pgDataDir}...`);
      await embeddedInstance.initialise();
      await embeddedInstance.start();
      console.log(`[Database] Embedded PostgreSQL successfully started on port ${port}!`);

      // Ensure clean exit
      process.on('SIGINT', async () => {
        if (embeddedInstance) {
          console.log('[Database] Stopping embedded PostgreSQL...');
          try {
            await embeddedInstance.stop();
          } catch {}
        }
        process.exit(0);
      });
    } catch (err) {
      console.error('[Database] Failed to launch embedded Postgres:', err.message);
      throw err;
    }
  }

  // Ensure target database exists
  try {
    const adminClient = new Client({
      host,
      port,
      user,
      password,
      database: 'postgres',
    });
    await adminClient.connect();

    const checkDb = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`[Database] Creating database "${dbName}"...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[Database] Database "${dbName}" created successfully.`);
    }

    await adminClient.end();
  } catch (err) {
    // If database already exists or connected directly to target db
    // console.log('[Database] Note on database creation check:', err.message);
  }

  return true;
}

if (require.main === module) {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  ensureDatabaseReady()
    .then(() => {
      console.log('[Database] Database check & preparation complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Database] Fatal database init error:', err);
      process.exit(1);
    });
}

module.exports = {
  ensureDatabaseReady,
  isPortOpen,
};
