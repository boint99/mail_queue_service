const workerQueue = require('./v1/queue/worker.queue')
const { connectRabbitMQ } = require('./config/rabbitmq.config')
const { initDB } = require('./config/db.config')
const dlxQueue = require('./v1/queue/dlx.queue')

const runWorker = async () => {
  try {
    await initDB()
    await connectRabbitMQ()
    await workerQueue()
    await dlxQueue.initDLQ()
    console.log('[Worker] Started successfully')
  } catch (error) {
    console.error('[Worker] Failed to start:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Worker] Shutting down gracefully...')
  const { closeRabbitMQ } = require('./config/rabbitmq.config')
  await closeRabbitMQ()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n[Worker] Received SIGTERM, shutting down...')
  const { closeRabbitMQ } = require('./config/rabbitmq.config')
  await closeRabbitMQ()
  process.exit(0)
})
runWorker()