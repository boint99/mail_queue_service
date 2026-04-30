const { getDB } = require('../../config/db.config')

class emailModel {
  constructor(email, name, status) {
    this.email = email
    this.name = name
    this.status = status || 'active'
  }

  static async insertEmail({ id, email, name, status }) {
    const db = getDB()

    const sql = `
      INSERT INTO emails (id, email, name, status)
      VALUES (?, ?, ?, ?)
      RETURNING *;
    `
    const values = [id, email, name, status || 'active']

    return new Promise((resolve, reject) => {
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