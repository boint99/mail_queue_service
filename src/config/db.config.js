const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, '../../db.sqlite')

function initDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('[DB] is failed to connect:', err.message)
        return reject(err)
      }

      console.log('[DB] Connected successfully')

      db.run(`
        CREATE TABLE IF NOT EXISTS emails (
          id TEXT PRIMARY KEY,
          to_email TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          retry_count INTEGER DEFAULT 0,
          last_error TEXT,
          sent_at DATETIME,
          failed_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (tableErr) => {
        if (tableErr) {
          console.error('[DB] fail to create table emails:', tableErr.message)
          return reject(tableErr)
        }

        console.log('[DB] emails table is ready')
        resolve(db)
      })
    })
  })
}

module.exports = initDB