const Redis = require('ioredis')
const envConfig = require('./env.config')

const redis = new Redis({
  host: envConfig.REDIS_HOST,
  port: envConfig.REDIS_PORT,
  password: envConfig.REDIS_PASS,
  retryStrategy: (times) => {
    const delay = Math.min(times * 500, 3000)
    console.log(`[Redis] Retrying connection... (attempt ${times})`)
    return delay
  }
})

redis.on('connect', () => {
  console.log('[Redis] ✅ Connected successfully')
})

redis.on('error', (err) => {
  console.error('[Redis] ❌ Connection error:', err.message)
})

module.exports = redis
