const MODEL = require('../model')

class emailSendModel extends MODEL {
  constructor() {
    super('email_sends')
  }
  async emailSendList() {
    return await this.FINDALL()
  }

  async sendEmailsByTaskId(data) {
    return await this.CREATE_MANY(data)
  }

  async getPendingEmails() {
    const query = `
    SELECT *
    FROM ${this.tableName}
    WHERE status = 'pending'
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
  `

    const { rows } = await this.db.query(query)
    return rows
  }
}

module.exports = new emailSendModel()