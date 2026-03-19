# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Create a non-root user for security
RUN adduser -D staticuser
RUN chown -R staticuser:staticuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R staticuser:staticuser /var/cache/nginx && \
    chown -R staticuser:staticuser /var/log/nginx && \
    chown -R staticuser:staticuser /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R staticuser:staticuser /var/run/nginx.pid

USER staticuser

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
