const { v7: uuidv7 } = require('uuid')
const emailTaskModel = require('../model/email.task.model')
const _omit = require('../../utils/_omit')

class EmailTaskService {

  static async emailTaskList() {
    const result = await emailTaskModel.emailTaskList()
    return result.map(task => _omit(task, ['deleted_at']))
  }

  static async emailTaskInsert(data) {
    const { campaign_name, sender_email, subject, html_content, status } = data

    if (!campaign_name || !sender_email || !subject) {
      throw new Error('Missing required fields!')
    }

    const existed = await emailTaskModel.findbyUnique('campaign_name', campaign_name)
    if (existed) {
      throw new Error('Campaign already exists!')
    }

    const newTask = {
      id: uuidv7(),
      campaign_name,
      sender_email,
      subject,
      html_content: html_content || null,
      status: status || 'active'
    }

    return await emailTaskModel.emailTaskInsert(newTask)
  }

  static async emailTaskUpdate(id, data) {
    if (!id) throw new Error('Invalid ID!')

    const existing = await emailTaskModel.findById(id)
    if (!existing) throw new Error('Campaign not found!')

    const updateData = {}

    if (data.campaign_name !== undefined) {
      if (data.campaign_name.length < 3) {
        throw new Error('Campaign name too short!')
      }
      updateData.campaign_name = data.campaign_name
    }

    if (data.sender_email !== undefined) {
      if (!data.sender_email.includes('@')) {
        throw new Error('Invalid sender email!')
      }
      updateData.sender_email = data.sender_email
    }

    if (data.subject !== undefined) {
      updateData.subject = data.subject
    }

    if (data.html_content !== undefined) {
      updateData.html_content = data.html_content
    }

    if (data.status !== undefined) {
      const validStatus = ['active', 'disabled']
      if (!validStatus.includes(data.status)) {
        throw new Error('Invalid status!')
      }
      updateData.status = data.status
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No data to update!')
    }

    return await emailTaskModel.emailTaskUpdate(id, updateData)
  }

  static async emailTaskDelete(id) {
    if (!id) throw new Error('Invalid ID!')

    const existing = await emailTaskModel.findById(id)
    if (!existing) throw new Error('Campaign not found!')

    if (existing.deleted_at !== null) {
      throw new Error('Campaign is not found!')
    }

    return await emailTaskModel.emailTaskDelete(id)
  }
}

module.exports = EmailTaskService