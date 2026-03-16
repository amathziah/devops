#!/bin/bash
set -e

echo "=== ShopSmart Setup ==="

# Get the directory where the script is located to handle paths correctly
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( dirname "$SCRIPT_DIR" )"

cd "$ROOT_DIR"

echo "Installing backend dependencies..."
(cd server && npm install)

echo "Installing frontend dependencies..."
(cd client && npm install)

echo "Starting services via Docker Compose..."
docker-compose up -d

echo ""
echo "Setup complete! Services are available at:"
echo "- Frontend:   http://localhost:3000"
echo "- Backend:    http://localhost:5000"
echo "- Grafana:     http://localhost:3001"
echo "- Prometheus:  http://localhost:9090"
echo ""
