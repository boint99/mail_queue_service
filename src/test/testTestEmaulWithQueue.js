// File: src/test-email.js

const { sendMail } = require('../config/mail.config')

async function testEmaulWithQueue() {
  try {
    console.log('>>> run Test Email')

    const testData = {
      to: 'test@example.com', // change email here
      subject: 'SEND TEST EMAIL FROM NODEJS',
      text: 'This is a plain text test email.',
      html: '<h1>Hello!</h1><p>This is a test email with <b>HTML</b> format.</p>'
    }

    const result = await sendMail(testData)

    console.log('SEND EMAIL SUCCESSFULLY!')
    console.log('Response information:', result)

  } catch (error) {
    console.error('Lỗi khi gửi email:', error)
  }
  process.exit(0)
}
testEmaulWithQueue()
