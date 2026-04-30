const nodemailer = require('nodemailer')
const envConfig = require('./env.config')

/**
 * Create SMTP transporter
 */
const transporter = nodemailer.createTransport({
  host: envConfig.SMTP_HOST,
  port: envConfig.SMTP_PORT,
  secure: false, // true for port 465
  auth: {
    user: envConfig.SMTP_USER,
    pass: envConfig.SMTP_PASS
  }
})

/**
 * Send email via SMTP
 * @param {Object} mailData - { to, subject, html, text, cc, bcc, attachments }
 * @returns {Object} - Nodemailer response
 */
async function sendMail(mailData) {
  const mailOptions = {
    from: envConfig.SMTP_FROM,
    to: mailData.to,
    subject: mailData.subject || '(No Subject)',
    ...(mailData.html && { html: mailData.html }),
    ...(mailData.text && { text: mailData.text }),
    ...(mailData.cc && { cc: mailData.cc }),
    ...(mailData.bcc && { bcc: mailData.bcc }),
    ...(mailData.attachments && { attachments: mailData.attachments })
  }

  const info = await transporter.sendMail(mailOptions)
  console.log(`[Mail] ✅ Sent to ${mailData.to} | MessageId: ${info.messageId}`)
  return info
}

module.exports = { sendMail }
