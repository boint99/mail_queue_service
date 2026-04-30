const { v7 } = require('uuid')
const emailModel = require('../model/email.model')

class emailService {
  static async emailList() {
    return await emailModel.emailList()
  }

  static async insertEmail(data) {
    const { email, name, status } = data

    if (!email || !name) {
      throw new Error('Missing required fields!')
    }

    const id = v7()
    return await emailModel.insertEmail({ id, email, name, status })
  }

}

module.exports = emailService