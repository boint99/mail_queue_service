// File: test-mail.js
const { sendMail } = require('../config/mail.config')

async function runSendEmail() {
  console.log('🚀 Bắt đầu test gửi email qua Postfix...')

  const testData = {
    from: 'boint99@gmail.com',
    to: 'boint99@gmail.com',
    subject: '[Test] Gửi từ Worker Node.js qua Postfix',
    html: '<h3>Thành công!</h3><p>Hệ thống Node.js đã kết nối và đẩy mail qua Postfix thành công.</p>'
  }

  try {
    await sendMail(testData)
    console.log('Chạy test script xong!')
  } catch (error) {
    console.error('Chạy test script thất bại:', error)
  }
}

runSendEmail()