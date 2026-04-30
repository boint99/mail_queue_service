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
    const { rows } = await db.query(sql)
    return rows
  }

  static async insertEmail({ id, email, name, status }) {
    const sql = `
      INSERT INTO emails (id, email, name, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const values = [id, email, name, status || 'active']

    const db = getDB()
    try {
      const { rows } = await db.query(sql, values)
      return rows[0]
    } catch (err) {
      console.error('[DB] Error inserting email:', err.message)
      throw err
    }
  }

  static async findbyidEmail(id) {
    const db = getDB()
    const sql = `
      SELECT e.id, e.deleted_at
      FROM emails as e
      WHERE e.id = $1
    `
    const values = [id]
    const { rows } = await db.query(sql, values)
    return rows[0]
  }

  static async updateEmail(id, data) {
    const db = getDB()

    const sql = `
    UPDATE emails
    SET name = COALESCE($1, name),
        status = COALESCE($2, status),
        email = COALESCE($3, email)
    WHERE id = $4
  `

    const values = [data.name, data.status, data.email, id]

    const result = await db.query(sql, values)
    return {
      changes: result.rowCount
    }
  }

  static async deleteEmail(id) {
    const db = getDB()

    const sql = `
    UPDATE emails
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND deleted_at IS NULL
  `

    const result = await db.query(sql, [id])
    return {
      deleted: result.rowCount > 0
    }
  }
}

module.exports = emailModel