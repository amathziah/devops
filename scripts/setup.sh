#!/bin/bash
set -e

echo "=== ShopSmart Multi-Environment Setup ==="

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 1. Environment Checks (Idempotent: doesn't error if already satisfied)
echo "Checking dependencies..."
if ! command_exists node; then echo "Node.js not found. Please install it first."; exit 1; fi
if ! command_exists docker; then echo "Docker not found. Required for local container stack."; exit 1; fi
if ! command_exists docker-compose; then echo "Docker-compose not found."; exit 1; fi

# Get the directory where the script is located to handle paths correctly
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( dirname "$SCRIPT_DIR" )"

cd "$ROOT_DIR"

# 2. Ensure critical directories exist
mkdir -p "$ROOT_DIR/logs"

# 3. Handle secrets (Idempotent: doesn't overwrite if present)
if [ ! -f "$ROOT_DIR/server/.env" ]; then
  echo "Generating server .env from example..."
  cp "$ROOT_DIR/server/.env.example" "$ROOT_DIR/server/.env"
fi

# 4. Dependency Installation
echo "Installing backend dependencies..."
(cd server && npm install --silent)

echo "Installing frontend dependencies..."
(cd client && npm install --silent)

# 5. Infrastructure Stack (Docker Compose is inherently idempotent)
echo "Starting services via Docker Compose..."
docker-compose up -d

echo ""
echo "Setup complete! Services are available at:"
echo "- Frontend:     http://localhost:3000"
echo "- Backend:      http://localhost:5000"
echo "- Grafana:      http://localhost:3001"
echo "- Prometheus:   http://localhost:9090"
echo ""
echo "Deployment status: SUCCESS"
