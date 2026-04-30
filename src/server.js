const express = require('express')
const { connectRabbitMQ } = require('./config/rabbitmq.config')
const envConfig = require('./config/env.config')
const initDB = require('./config/db.config')

const app = express()
app.use(express.json())

const PORT = envConfig.API_PORT

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

async function STARTSERVER() {
  let db
  try {
    await connectRabbitMQ()

    db = await initDB()
    app.locals.db = db

    app.listen(PORT, () => {
      console.log(`Mail Queue API Server running on port ${PORT}`)
      console.log(`Health: http://localhost:${PORT}/health`)
    })
  } catch (err) {
    console.error('[Server] Failed to start:', err.message)
    process.exit(1)
  }
}

module.exports = STARTSERVER
