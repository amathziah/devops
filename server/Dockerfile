# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# --- Final Stage ---
FROM node:20-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
USER nodejs

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
