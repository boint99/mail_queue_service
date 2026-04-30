const { getDB } = require('../../config/db.config')

class emailModel {
  constructor(email, name, status) {
    this.email = email
    this.name = name
    this.status = status || 'active'
  }

  static async emailList() {
    const db = getDB()
    const sql = `
      SELECT e.id, e.email, e.name, e.status, e.created_at
      FROM emails as e
      WHERE e.deleted_at IS NULL
      ORDER BY e.created_at ASC
    `
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    })
  }

  static async insertEmail({ id, email, name, status }) {

    const sql = `
      INSERT INTO emails (id, email, name, status)
      VALUES (?, ?, ?, ?)
      RETURNING *;
    `
    const values = [id, email, name, status || 'active']

    return new Promise((resolve, reject) => {
      const db = getDB()
      db.get(sql, values, (err, row) => {
        if (err) {
          console.error('[DB] Error inserting email:', err.message)
          return reject(err)
        }
        resolve(row)
      })
    })
  }
}

module.exports = emailModel