const { connectRabbitMQ } = require('./config/rabbitmq.config')
const redis = require('./config/redis.config')
const queueConfig = require('./config/queue.config')
const { sendMail } = require('./config/mail.config')

/**
 * Worker - Consume messages từ queue và gửi email
 */
async function STARTWORKER() {
  try {
    const channel = await connectRabbitMQ()

    if (channel) {
      channel.prefetch(queueConfig.PREFETCH_COUNT)

      channel.consume(queueConfig.QUEUE_SEND_MAIL, async (msg) => {
        if (!msg) return

        let message
        try {
          message = JSON.parse(msg.content.toString())
        } catch (parseErr) {
          // console.error(`[Worker] ❌ Invalid message format, rejecting: ${parseErr.message}`)
          channel.reject(msg, false)
          return
        }

        const { messageId, data, retryCount = 0 } = message

        // console.log(`[Worker] 📬 Processing: ${messageId} | To: ${data.to} | Retry: ${retryCount}/${queueConfig.MAX_RETRIES}`)

        try {
          // Cập nhật trạng thái: đang xử lý
          await redis.hset(`mail:${messageId}`, 'status', 'processing')

          // Gửi email
          await sendMail(data)

          // Thành công -> ack message
          channel.ack(msg)

          // Cập nhật trạng thái: thành công
          await redis.hset(
            `mail:${messageId}`,
            'status', 'sent',
            'sentAt', new Date().toISOString()
          )

          // console.log(`[Worker] ✅ Sent successfully: ${messageId}`)
        } catch (err) {
          // console.error(`[Worker] ❌ Failed to send ${messageId}:`, err.message)

          if (retryCount < queueConfig.MAX_RETRIES) {
            // Retry: ack message cũ, publish message mới với retryCount tăng
            channel.ack(msg)

            const retryMessage = {
              ...message,
              retryCount: retryCount + 1,
              lastError: err.message,
              lastRetryAt: new Date().toISOString()
            }

            // Delay trước khi retry
            setTimeout(() => {
              channel.publish(
                queueConfig.EXCHANGE_NAME,
                queueConfig.ROUTING_KEY_SEND,
                Buffer.from(JSON.stringify(retryMessage)),
                {
                  persistent: true,
                  messageId,
                  contentType: 'application/json'
                }
              )
              // console.log(`[Worker] 🔄 Retrying ${messageId} (${retryCount + 1}/${queueConfig.MAX_RETRIES})`)
            }, queueConfig.RETRY_DELAY_MS)

            // Cập nhật trạng thái
            await redis.hset(
              `mail:${messageId}`,
              'status', 'retrying',
              'retryCount', String(retryCount + 1),
              'lastError', err.message
            )
          } else {
            // Hết retry -> reject, gửi vào dead letter queue
            channel.reject(msg, false)

            // Cập nhật trạng thái: thất bại
            await redis.hset(
              `mail:${messageId}`,
              'status', 'failed',
              'failedAt', new Date().toISOString(),
              'lastError', err.message
            )

            // console.log(`[Worker] 💀 Message ${messageId} moved to dead letter queue`)
          }
        }
      })
    }
  } catch (err) {
    // console.error('[Worker] ❌ Failed to start:', err.message)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  // console.log('\n[Worker] Shutting down gracefully...')
  const { closeRabbitMQ } = require('./config/rabbitmq.config')
  await closeRabbitMQ()
  await redis.quit()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  // console.log('\n[Worker] Received SIGTERM, shutting down...')
  const { closeRabbitMQ } = require('./config/rabbitmq.config')
  await closeRabbitMQ()
  await redis.quit()
  process.exit(0)
})

module.exports = STARTWORKER
