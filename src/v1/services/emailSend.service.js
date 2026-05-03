const emailTaskModel = require('../model/email.task.model')
const { v7 } = require('uuid')
const emailSendModel = require('../model/email_send.model')
const Producer = require('../rabbitQueue/producer')

class emailSendService {

  static async sendEmailsByTaskId(taskId, data) {
    const { to, cc, bcc } = data

    if (!taskId) throw new Error('The Campaign is required!')
    if (!to || to.length === 0) throw new Error('The To is required!')

    const checkCampaign = await emailTaskModel.findById(taskId)

    if (!checkCampaign) throw new Error('The Campaign is not found!')

    const buildRecords = (list, type) =>
      list.map(email => ({
        id: v7(),
        task_id: taskId,
        recipient_email: email,
        channel: type
      }))

    const records = [
      ...buildRecords(to, 'to'),
      ...buildRecords(cc, 'cc'),
      ...buildRecords(bcc, 'bcc')
    ]

    // Save list email to send to DB
    await emailSendModel.sendEmailsByTaskId(records)

    const queryEmailPending = await emailSendModel.getPendingEmails()

    // Send list email to RabbitMQ
    const dataSendRabbit = queryEmailPending.map(item => ({
      id: item.id,
      task_id: item.task_id,
      email_send: checkCampaign.sender_email,
      recipient_email: item.recipient_email,
      channel: item.channel,
      subject: checkCampaign.subject,
      html_content: checkCampaign.html_content
    }))
    console.log('🚀 ~ emailSendService ~ sendEmailsByTaskId ~ dataSendRabbit:', dataSendRabbit)

    await Producer.sendEmailsByTaskId(dataSendRabbit)

    return { status: true, message: 'The emails have been sent to the queue successfully' }
  }

}

module.exports = emailSendService