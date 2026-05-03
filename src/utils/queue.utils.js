const QUEUE_UTILS = {
  EXCHANGE_NAME: 'mail_exchange', // Exchange name main
  EXCHANGE_TYPE: 'direct', // Exchange type
  QUEUE_SEND_MAIL: 'mail_queue', // Work queue
  QUEUE_DEAD_LETTER: 'mail_dead_queue', // Dead letter queue
  ROUTING_KEY_SEND: 'mail-send', // Send routing key
  ROUTING_KEY_DEAD: 'mail-dead', // Dead routing key
  MAX_RETRIES: 5, // Max retries before moving to dead letter queue
  RETRY_DELAY_MS: 1000, // 10 seconds
  PREFETCH_COUNT: 5 // Number of messages to prefetch
}

module.exports = QUEUE_UTILS