const amqp = require('amqplib')
const envConfig = require('./env.config')
const QUEUE_UTILS = require('../utils/queue.utils')

let connection = null
let channel = null

async function connectRabbitMQ(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqp.connect(envConfig.RABBITMQ_URL)
      channel = await connection.createChannel()

      // auto setup queue & exchange
      await setupQueues(channel)

      connection.on('close', () => {
        console.error('[RabbitMQ] Connection closed. Reconnecting...')
        setTimeout(() => connectRabbitMQ(), 5000)
      })

      connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err.message)
      })

      console.log('[RabbitMQ] ✅ Connected successfully')
      return channel
    } catch (err) {
      console.error(`[RabbitMQ] ❌ Connection failed (attempt ${i + 1}/${retries}):`, err.message)
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw new Error('[RabbitMQ] Failed to connect after all retries')
}

async function setupQueues(ch) {
  // create exchange
  await ch.assertExchange(QUEUE_UTILS.EXCHANGE_NAME, QUEUE_UTILS.EXCHANGE_TYPE, {
    durable: true
  })

  // create dead letter queue
  await ch.assertQueue(QUEUE_UTILS.QUEUE_DEAD_LETTER, {
    durable: true
  })
  await ch.bindQueue(QUEUE_UTILS.QUEUE_DEAD_LETTER, QUEUE_UTILS.EXCHANGE_NAME, QUEUE_UTILS.ROUTING_KEY_DEAD)

  // create queue main
  await ch.assertQueue(QUEUE_UTILS.QUEUE_SEND_MAIL, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': QUEUE_UTILS.EXCHANGE_NAME,
      'x-dead-letter-routing-key': QUEUE_UTILS.ROUTING_KEY_DEAD
    }
  })
  await ch.bindQueue(QUEUE_UTILS.QUEUE_SEND_MAIL, QUEUE_UTILS.EXCHANGE_NAME, QUEUE_UTILS.ROUTING_KEY_SEND)
}

function getChannel() {
  if (!channel) {
    throw new Error('[RabbitMQ] Channel not initialized. Call connectRabbitMQ() first.')
  }
  return channel
}

async function closeRabbitMQ() {
  try {
    if (channel) await channel.close()
    if (connection) await connection.close()
    console.log('[RabbitMQ] Connection closed')
  } catch (err) {
    console.error('[RabbitMQ] Error closing connection:', err.message)
  }
}

module.exports = { connectRabbitMQ, getChannel, closeRabbitMQ }
