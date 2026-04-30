require('dotenv').config()

const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  // API Server
  API_PORT: parseInt(process.env.API_PORT) || 3000,

  // RabbitMQ
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
  RABBITMQ_USER: process.env.RABBITMQ_USER || 'admin',
  RABBITMQ_PASS: process.env.RABBITMQ_PASS || 'admin123',
  RABBITMQ_PORT: parseInt(process.env.RABBITMQ_PORT) || 5672,
  RABBITMQ_MGMT_PORT: parseInt(process.env.RABBITMQ_MGMT_PORT) || 15672,
  RABBITMQ_VHOST: process.env.RABBITMQ_VHOST || '/',
  get RABBITMQ_URL() {
    const host = this.RABBITMQ_HOST
    const port = this.RABBITMQ_PORT
    const user = encodeURIComponent(this.RABBITMQ_USER)
    const pass = encodeURIComponent(this.RABBITMQ_PASS)
    // Special case for default vhost "/"
    const vhost = this.RABBITMQ_VHOST === '/' ? '' : encodeURIComponent(this.RABBITMQ_VHOST)
    return process.env.RABBITMQ_URL || `amqp://${user}:${pass}@${host}:${port}/${vhost}`
  },

  // Postgres
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT) || 5432,
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  POSTGRES_DB: process.env.POSTGRES_DB || 'database',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
  REDIS_PASS: process.env.REDIS_PASS || '',

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || ''
}

module.exports = envConfig