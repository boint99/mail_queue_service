const { getChannel } = require('../../config/rabbitmq.config')
const QUEUE_UTILS = require('../../utils/queue.utils')
const { sendMail } = require('../../config/mail.config')
const { getDB } = require('../../config/db.config')

async function workerQueue() {
  try {
    const ch = await getChannel()
    const db = getDB()

    const QUEUE_SEND_MAIL = QUEUE_UTILS.QUEUE_SEND_MAIL
    const PREFETCH_COUNT = QUEUE_UTILS.PREFETCH_COUNT

    ch.prefetch(PREFETCH_COUNT)

    ch.consume(QUEUE_SEND_MAIL, async (msg) => {
      if (!msg) return

      let message
      try {
        message = JSON.parse(msg.content.toString()).record
        console.log('🚀 ~ Đang xử lý message:', message)

        const mailOptions = {
          from: message.email_send,
          to: message.channel === 'to' ? message.recipient_email : undefined,
          cc: message.channel === 'cc' ? message.recipient_email : undefined,
          bcc: message.channel === 'bcc' ? message.recipient_email : undefined,
          subject: message.subject,
          html: message.html_content
        }
        console.log('🚀 ~ Đang xử lý message:', mailOptions)
        await sendMail(mailOptions)
        console.log('[📧] Gửi SMTP xong.')

        await db.query(`
            UPDATE email_sends
            SET status = 'processing', sent_at = $2
            WHERE id = $1 AND status = 'pending'
            RETURNING id;
          `, [message.id])

        await db.query('UPDATE email_sends SET status = \'sent\', sent_at = $2 WHERE id = $1', [message.id, new Date()])
        console.log(`[✅] Đã cập nhật thành công DB cho: ${message.recipient_email}`)

        ch.ack(msg)
      } catch ( error) {
        console.error(`[❌] Lỗi khi xử lý email ${message?.recipient_email}:`, error.message)
        // await db.query(`
        //     UPDATE email_sends
        //     SET status = 'failed'
        //     WHERE id = $1
        //   `, [message.id])

        ch.ack(msg)
      }
    })
  } catch (err) {
    console.error('[Worker] ❌ Failed to start:', err)
    process.exit(1)
  }
}

module.exports = workerQueue
