const { Pool } = require('pg')
const envConfig = require('./env.config')

let poolInstance = null

function initDB() {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      host: envConfig.POSTGRES_HOST,
      port: envConfig.POSTGRES_PORT,
      user: envConfig.POSTGRES_USER,
      password: envConfig.POSTGRES_PASSWORD,
      database: envConfig.POSTGRES_DB
    })

    pool.connect((err, client, release) => {
      if (err) {
        console.error('[DB] is failed to connect:', err.message)
        return reject(err)
      }

      console.log('[DB] Connected successfully')

      client.query(`
            DO $$
            BEGIN
              -- ENUM cho status email, task,
              IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
                CREATE TYPE status_enum AS ENUM ('active', 'disabled');
              END IF;

              -- ENUM cho send
              IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_send_enum') THEN
                CREATE TYPE status_send_enum AS ENUM ('pending', 'sent', 'failed');
              END IF;
            END$$;

            CREATE TABLE IF NOT EXISTS emails (
              id TEXT PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              name TEXT,
              status status_enum NOT NULL DEFAULT 'active',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
            );

            CREATE TABLE IF NOT EXISTS email_tasks (
              id TEXT PRIMARY KEY,
              campaign_name TEXT NOT NULL,
              sender_email TEXT NOT NULL,
              subject TEXT NOT NULL,
              html_content TEXT,
              status status_enum NOT NULL DEFAULT 'active',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
            );

            CREATE TABLE IF NOT EXISTS email_sends (
              id TEXT PRIMARY KEY,
              task_id TEXT NOT NULL,
              email_id TEXT,
              to_email TEXT NOT NULL,
              status status_send_enum NOT NULL DEFAULT 'pending',
              retry_count INTEGER DEFAULT 0,
              last_error TEXT,
              sent_at TIMESTAMP,
              failed_at TIMESTAMP,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (task_id) REFERENCES email_tasks(id) ON DELETE CASCADE,
              FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE SET NULL
            );


            CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
            CREATE INDEX IF NOT EXISTS idx_email_sends_task_id ON email_sends(task_id);
      `, (tableErr) => {
        release()
        if (tableErr) {
          console.error('[DB] fail to create tables:', tableErr.message)
          return reject(tableErr)
        }

        console.log('[DB] tables are ready')
        poolInstance = pool
        resolve(pool)
      })
    })
  })
}

function getDB() {
  if (!poolInstance) {
    throw new Error('[DB] Not initialized. Call initDB() first.')
  }
  return poolInstance
}

module.exports = { initDB, getDB }
