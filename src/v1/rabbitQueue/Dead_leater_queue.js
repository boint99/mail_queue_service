const { getChannel } = require('../../config/rabbitmq.config')
const QUEUE_UTILS = require('../../utils/queue.utils')

class DeadLetterQueue {
  static async initDLQ() {
    const ch = getChannel()

    const EXCHANGE_NAME = QUEUE_UTILS.EXCHANGE_NAME
    const QUEUE_DEAD_LETTER = QUEUE_UTILS.QUEUE_DEAD_LETTER
    const EXCHANGE_TYPE = QUEUE_UTILS.EXCHANGE_TYPE


    await ch.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true })
    await ch.bindQueue(QUEUE_DEAD_LETTER, EXCHANGE_NAME, '')
    await ch.assertQueue(QUEUE_DEAD_LETTER, {
      durable: true
    })

    ch.consume(QUEUE_DEAD_LETTER, (msg) => {
      console.log(' [DEAD]', msg.content.toString())
      ch.ack(msg)
    })
  }
}

module.exports = DeadLetterQueue
