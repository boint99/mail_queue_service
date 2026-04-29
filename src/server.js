const express = require("express");
const { connectRabbitMQ } = require("./config/rabbitmq.config");
const envConfig = require("./config/env.config");

const app = express();
app.use(express.json());

const PORT = envConfig.API_PORT;

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function STARTSERVER() {
  try {
    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`\n 1. Mail Queue API Server running on port ${PORT}`);
      console.log(`   2. Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("[Server] Failed to start:", err.message);
    process.exit(1);
  }
}

module.exports = STARTSERVER;
