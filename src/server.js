const express = require('express')
const { connectRabbitMQ } = require('./config/rabbitmq.config')
const envConfig = require('./config/env.config')
const { initDB } = require('./config/db.config')
const Router = require('./v1/routes')

const PORT = envConfig.API_PORT


const app = express()
app.use(express.json())

/**
 * Health check
 */
app.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * Initialize API routes
 */
app.use('/api/v1', Router)

async function STARTSERVER() {
  console.log('>>> STARTSERVER called')

  try {
    console.log('>>> Step 1: DB')
    await initDB()

    console.log('>>> Step 2: RabbitMQ')
    await connectRabbitMQ()

    console.log('>>> Step 3: Listen')
    app.listen(PORT, () => {
      console.log('Server running on port', `http://localhost:${PORT}`)
    })

  } catch (err) {
    console.error('[Server] Failed:', err.message)
    process.exit(1)
  }
}


module.exports = STARTSERVER