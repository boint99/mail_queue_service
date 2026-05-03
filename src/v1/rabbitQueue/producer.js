const { getChannel } = require('../../config/rabbitmq.config')
const QUEUE_UTILS = require('../../utils/queue.utils')

class Producer {
  static async sendEmailsByTaskId(records) {
    const ch = await getChannel()

    const QUEUE_SEND_MAIL = QUEUE_UTILS.QUEUE_SEND_MAIL

    if (ch) {
      for (const record of records) {
        const messagePayload = { record }

        ch.sendToQueue(
          QUEUE_SEND_MAIL,
          Buffer.from(JSON.stringify(messagePayload)),
          {
            persistent: true
          }
        )
      }
      console.log(`Đã đẩy thành công ${records.length} tasks vào RabbitMQ!`)

    } else {
      console.log('RabbitMQ Connection is not ready!')
    }

    return true
  }
}

module.exports = Producer