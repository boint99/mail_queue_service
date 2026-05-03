const { initDB, getDB } = require('../config/db.config')
const Producer = require('../v1/rabbitQueue/producer')
const { connectRabbitMQ } = require('../config/rabbitmq.config')


const testProducers = async () => {
  try {
    await initDB()
    const db = getDB()
    await connectRabbitMQ()
    console.log('<<< RUN TEST DB COMPLETED >>>')

    const result = await db.query(`
      SELECT *
      FROM email_tasks AS et
      JOIN email_sends AS es ON es.task_id = et.id
      WHERE et.status = 'active' AND es.status = 'pending' and et.deleted_at is null;
    `, [])

    const record = result.rows.map(item => ({
      id: item.id,
      task_id: item.task_id,
      email_send: item.sender_email,
      recipient_email: item.recipient_email,
      channel: item.channel,
      subject: item.subject,
      html_content: item.html_content
    }))
    await Producer.sendEmailsByTaskId(record)

    setTimeout(() => {
      console.log('✅ Dữ liệu đã an toàn trong Queue. Tắt tiến trình!')
      process.exit(0)
    }, 10000)
  } catch (error) {
    console.error('❌ Lỗi:', error)
    await process.exit(1)
  }
}

testProducers()