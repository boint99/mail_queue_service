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


  static async updateEmail(id, data) {
    if (!id || !data) {
      throw new Error('Invalid input')
    }

    const existing = await emailModel.findbyidEmail(id)

    if (!existing) {
      throw new Error('Email not found')
    }

    const updateData = {}

    if (data.name !== undefined) {
      if (data.name.length < 3) {
        throw new Error('Name too short')
      }
      updateData.name = data.name
    }

    if (data.status !== undefined) {
      if (!['active', 'disabled'].includes(data.status)) {
        throw new Error('Invalid status')
      }
      updateData.status = data.status
    }

    if (data.email !== undefined) {
      if (!data.email.includes('@')) {
        throw new Error('Invalid email')
      }
      updateData.email = data.email
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No data to update')
    }

    console.log(updateData)
    return await emailModel.updateEmail(id, updateData)
  }
}

module.exports = emailService