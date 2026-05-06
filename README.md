# ShopSmart — Inventory Management Platform

ShopSmart is a full-stack inventory management app with a production-grade DevOps pipeline featuring automated testing, infrastructure-as-code, and continuous deployment to AWS ECS Fargate.

**Live URL:** http://shopsmart-alb-35311648.us-east-1.elb.amazonaws.com

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, served via nginx |
| Backend | Node.js, Express |
| Infrastructure | AWS ECS Fargate, ECR, ALB, S3 — managed with Terraform |
| CI/CD | GitHub Actions |
| Testing | Jest (backend), Vitest (frontend), Playwright (E2E) |

## Architecture

```
Internet
   ↓
Application Load Balancer (stable DNS, port 80)
   ├── /auth/*  → Backend container (port 5000)
   ├── /items/* → Backend container (port 5000)
   └── /*       → Frontend container (port 8080)
              ↓
         ECS Fargate Task
         (runs in AWS, no servers to manage)
              ↓
         ECR (Docker image registry)
```

## CI/CD Pipeline

Every push to `main` automatically:

1. **Lint** — ESLint on frontend and backend
2. **Test** — Unit and integration tests with coverage reports uploaded as artifacts
3. **Terraform** — Provisions/updates AWS infrastructure (ALB, ECS, ECR, S3, IAM, CloudWatch)
4. **Build & Push** — Docker images built and pushed to ECR
5. **Deploy** — ECS service force-redeployed and waited on to stabilize

Pull requests run lint + tests only (no deploy).

## Local Development

```bash
git clone https://github.com/amathziah/devops.git
cd devops

# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# Run backend (port 5000)
cd server && npm run dev

# Run frontend (port 5173) in a separate terminal
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Testing

```bash
# Backend unit + integration tests
cd server && npm test

# Frontend unit tests
cd client && npm test

# E2E tests (requires app running)
npm run test:e2e
```

## Infrastructure

All AWS infrastructure is defined as code in `terraform/`:

| File | Purpose |
|---|---|
| `main.tf` | All AWS resources (ECS, ALB, ECR, S3, IAM, CloudWatch, Security Groups) |
| `variables.tf` | Input variables (region, project name) |
| `outputs.tf` | Printed values after apply (URLs, cluster name) |

Resources created:
- S3 bucket (app storage)
- ECR repositories (backend + frontend Docker images)
- ECS Fargate cluster, task definition, and service
- Application Load Balancer with path-based routing rules
- IAM roles for ECS task execution
- CloudWatch log group (7 day retention)
- Security groups (ALB allows public traffic, ECS only accepts traffic from ALB)

## Project Structure

```
devops/
├── client/               # React frontend (Vite)
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── server/               # Node.js backend (Express)
│   ├── src/
│   ├── Dockerfile
│   └── data.json         # File-based storage (dev/demo only)
├── terraform/            # Infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── e2e/                  # Playwright end-to-end tests
└── .github/workflows/
    └── deploy.yml        # CI/CD pipeline
```
