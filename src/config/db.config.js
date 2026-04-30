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
            CREATE TABLE IF NOT EXISTS emails (
              id TEXT PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              name TEXT,
              status TEXT DEFAULT 'active',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
            );

            CREATE TABLE IF NOT EXISTS email_tasks (
              id TEXT PRIMARY KEY,
              campaign_name TEXT NOT NULL,
              sender_email TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS email_sends (
              id TEXT PRIMARY KEY,
              task_id TEXT NOT NULL,
              contact_id TEXT,
              to_email TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'pending', --pending, sent, failed
              retry_count INTEGER DEFAULT 0,
              last_error TEXT,
              sent_at TIMESTAMP,
              failed_at TIMESTAMP,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (task_id) REFERENCES email_tasks(id) ON DELETE CASCADE,
              FOREIGN KEY (contact_id) REFERENCES emails(id) ON DELETE SET NULL
            );

            CREATE INDEX IF NOT EXISTS idx_email_sends_task_id ON email_sends(task_id);
            CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
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
