const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, '../../db.sqlite')

let dbInstance = null

function initDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('[DB] is failed to connect:', err.message)
        return reject(err)
      }

      console.log('[DB] Connected successfully')

      db.exec(`
            CREATE TABLE IF NOT EXISTS emails (
              id TEXT PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              name TEXT,
              status TEXT DEFAULT 'active',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              deleted_at DATETIME DEFAULT NULL
            );

            CREATE TABLE IF NOT EXISTS email_tasks (
              id TEXT PRIMARY KEY,
              campaign_name TEXT NOT NULL,
              sender_email TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS email_sends (
              id TEXT PRIMARY KEY,
              task_id TEXT NOT NULL,
              contact_id TEXT,
              to_email TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'pending', --pending, sent, failed
              retry_count INTEGER DEFAULT 0,
              last_error TEXT,
              sent_at DATETIME,
              failed_at DATETIME,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (task_id) REFERENCES mail_tasks(id) ON DELETE CASCADE,
              FOREIGN KEY (contact_id) REFERENCES emails(id) ON DELETE SET NULL
            );

            CREATE INDEX IF NOT EXISTS idx_email_sends_task_id ON email_sends(task_id);
            CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
      `, (tableErr) => {
        if (tableErr) {
          console.error('[DB] fail to create tables:', tableErr.message)
          return reject(tableErr)
        }

        console.log('[DB] mail_tasks and emails tables are ready')
        dbInstance = db
        resolve(db)
      })
    })
  })
}

function getDB() {
  if (!dbInstance) {
    throw new Error('[DB] Not initialized. Call initDB() first.')
  }
  return dbInstance
}

module.exports = { initDB, getDB }
