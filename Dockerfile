FROM node:22-alpine

WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json ./
RUN yarn install --production --frozen-lockfile 2>/dev/null || yarn install --production

# Copy source code
COPY . .

# Default command (overridden in docker-compose)
CMD ["node", "src/app.js"]
