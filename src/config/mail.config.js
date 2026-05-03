const nodemailer = require('nodemailer')
const envConfig = require('./env.config')

/**
 * Create SMTP transporter to LOCAL POSTFIX
 */
const transporter = nodemailer.createTransport({
  host: envConfig.POSTFIX_HOST,
  port: envConfig.POSTFIX_PORT_SEND,
  secure: false,
  tls: {
    rejectUnauthorized: false
  }
})

/**
 * Send email via Postfix SMTP Relay
 * @param {Object} mailData - { from, to, subject, html, text, cc, bcc, attachments }
 * @returns {Object} - Nodemailer response
 */
async function sendMail(mailData) {
  const mailOptions = {
    from: mailData.from || envConfig.SMTP_FROM,
    to: mailData.to,
    subject: mailData.subject || '(No Subject)',
    ...(mailData.html && { html: mailData.html }),
    ...(mailData.text && { text: mailData.text }),
    ...(mailData.cc && { cc: mailData.cc }),
    ...(mailData.bcc && { bcc: mailData.bcc }),
    ...(mailData.attachments && { attachments: mailData.attachments }),
    envelope: {
      from: 'boint@vienthongact.vn',
      to: mailData.to
    }
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`[Mail] Đã đẩy sang Postfix thành công (Từ: ${mailOptions.from} -> Tới: ${mailOptions.to}) | MessageId: ${info.messageId}`)
    return info
  } catch (error) {
    console.error('[Mail] ❌ Lỗi khi kết nối/gửi tới Postfix:', error.message)
    throw error
  }
}

module.exports = { sendMail }