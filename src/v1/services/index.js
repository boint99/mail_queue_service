const { v7 } = require('uuid')
const emailModel = require('../model/email.model')

class emailService {

  static async listEmails() {
    console.log('>>> listEmails')
  }

  static async insertEmail(data) {
    const { email, name, status } = data
    console.log('>>> insertEmail', email, name, status)
    if (!email || !name) {
      throw new Error('Missing required fields!')
    }

    const id = v7()
    return await emailModel.insertEmail({ id, email, name, status })
  }

}

module.exports = emailService