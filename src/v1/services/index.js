const { v7 } = require('uuid')
const emailModel = require('../model/email.model')
const omit = require('../../utils/_omit')

class emailService {
  static async emailList() {
    const result = await emailModel.emailList()
    return result.map(email => omit(email, ['deleted_at']))
  }

  static async insertEmail(data) {
    const checkEmail = await emailModel.findbyUnique('email', data.email)
    if (checkEmail) {
      throw new Error('This email is duplicate emails!')
    }
    const id = v7()
    const emailData = {
      id: id,
      email: data.email,
      name: data.name,
      status: data.status || 'active'
    }
    return await emailModel.insertEmail(emailData)
  }


  static async updateEmail(id, data) {
    if (!id || !data) {
      throw new Error('Invalid input')
    }

    const existing = await emailModel.findById(id)

    if (!existing) {
      throw new Error('Email not found!')
    }

    if (existing.deleted_at !== null) {
      throw new Error('Email is not found!')
    }

    const updateData = {}

    if (data.name !== undefined) {
      if (data.name.length < 3) {
        throw new Error('Name too short!')
      }
      updateData.name = data.name
    }

    if (data.status !== undefined) {
      if (!['active', 'disabled'].includes(data.status)) {
        throw new Error('Invalid status!')
      }
      updateData.status = data.status
    }

    if (data.email !== undefined) {
      if (!data.email.includes('@')) {
        throw new Error('Invalid email!')
      }
      updateData.email = data.email
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No data to update!')
    }

    return await emailModel.updateEmail(id, updateData)
  }

  static async deleteEmail(id) {
    if (!id) {
      throw new Error('Invalid input!')
    }

    const existing = await emailModel.findbyid(id)

    if (!existing) {
      throw new Error('Email not foun d!')
    }

    if (existing.deleted_at !== null) {
      throw new Error('Email is not found!')
    }

    return await emailModel.deleteEmail(id)
  }
}

module.exports = emailService