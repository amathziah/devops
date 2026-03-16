# ShopSmart — Full Stack DevOps Project

ShopSmart is a comprehensive full-stack application demonstrative of modern DevOps practices, featuring a React frontend, an Express backend, and a robust automation suite covering CI/CD, Containerization, Orchestration, Infrastructure as Code, and Monitoring.

## 🚀 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Database**: SQLite / JSON-based mock data
- **Containerization**: Docker
- **Orchestration**: Kubernetes (K8s), Docker Compose
- **Infrastructure as Code**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoring & Logging**: Prometheus, Grafana, Loki

## 🏗️ Architecture

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌───────────────┐
│             │     │              │     │             │     │               │
│   GitHub    ├───▶ │  CI/CD (GHA) ├───▶ │Docker Images│───▶ │  K8s / Render │
│             │     │              │     │   (GHCR)    │     │               │
└─────────────┘     └──────────────┘     └─────────────┘     └───────────────┘
                                                                     │
                                                             ┌───────▼───────┐
                                                             │               │
                                                             │  Monitoring   │
                                                             │  (Grafana)    │
                                                             │               │
                                                             └───────────────┘
```

## 📁 Project Structure

```text
.
├── client/                     # React Frontend
│   └── src/                    # Frontend source code
├── server/                     # Express Backend
│   └── src/                    # Backend source code
├── k8s/                        # Kubernetes manifests
│   ├── backend-deployment.yml
│   └── frontend-deployment.yml
├── terraform/                  # Terraform IaC
│   └── main.tf
├── monitoring/                 # Observability stack
│   ├── docker-compose.monitoring.yml
│   └── prometheus.yml
├── scripts/                    # Automation scripts
│   └── setup.sh
└── .github/workflows/          # CI/CD Workflows
    ├── node-ci.yml             # Tests & Linting
    ├── docker.yml              # Build, Push & Health Check
    └── terraform.yml           # IaC Validation
```

## 🛠️ Local Setup

The project includes an idempotent setup script to simplify onboarding:

```bash
# 1. Run the automation setup script (Installs deps + starts Docker)
./scripts/setup.sh

# Or 2. Start manually via Docker Compose
docker-compose up -d
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)

## 🔄 CI/CD Pipeline

The project uses three main GitHub Actions workflows:

1.  **`node-ci.yml`**: Runs on every PR/push. Installs dependencies and executes unit/integration tests for both client and server.
2.  **`docker.yml`**: Triggers on push to `main`. Builds Docker images, pushes them to GHCR, and performs a 15s-delayed post-deploy health check.
3.  **`terraform.yml`**: Validates Infrastructure as Code on every pull request using `terraform fmt`, `init`, and `validate`.

## ☸️ Kubernetes

Deploy the application to a Kubernetes cluster using the provided manifests:

```bash
kubectl apply -f k8s/
```

- **Backend**: Internal `ClusterIP` on port 5000.
- **Frontend**: `NodePort` mapping port 3000 to internal port 80.

## 🌍 Terraform

Manage Docker infrastructure using Terraform:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 📊 Monitoring

Monitor the application performance and logs using the observability stack:

```bash
# Start the monitoring stack
docker-compose -f monitoring/docker-compose.monitoring.yml up -d
```

- **Grafana**: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `admin`)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Loki**: [http://localhost:3100](http://localhost:3100) (Log aggregation)
