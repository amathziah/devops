# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

RUN adduser -D staticuser && \
    chown -R staticuser:staticuser /usr/share/nginx/html && \
    chown -R staticuser:staticuser /var/cache/nginx && \
    chown -R staticuser:staticuser /var/log/nginx && \
    chown -R staticuser:staticuser /etc/nginx/conf.d && \
    mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R staticuser:staticuser /tmp

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

USER staticuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
