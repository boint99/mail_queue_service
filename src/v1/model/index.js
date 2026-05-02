const { getDB } = require('../../config/db.config')

class MODEL {
  constructor(tableName) {
    this.tableName = tableName
  }

  get db() {
    return getDB()
  }

  async FINDALL() {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE deleted_at IS NULL
      ORDER BY created_at ASC
    `
    const { rows } = await this.db.query(query)
    return rows
  }

  async FINDBYID(id) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE id = $1 AND deleted_at IS NULL
    `
    const { rows } = await this.db.query(query, [id])
    return rows[0]
  }

  async CREATE(data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const columns = keys.join(', ')

    const query = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `

    await this.db.query(query, values)
    return
  }

  async UPDATE(id, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')

    const query = `
      UPDATE ${this.tableName}
      SET ${setString}
      WHERE id = $${keys.length + 1} AND deleted_at IS NULL
      RETURNING *
    `

    await this.db.query(query, [...values, id])
    return
  }

  async DELETE(id) {
    const query = `
      UPDATE ${this.tableName}
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `
    await this.db.query(query, [id])
    return
  }

  async FINDBYUNIQUE(column, value) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ${column} = $1 AND deleted_at IS NULL
    `
    const { rows } = await this.db.query(query, [value])
    return rows[0]
  }
}

module.exports = MODEL