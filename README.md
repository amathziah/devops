# ShopSmart — Inventory Management Platform

ShopSmart is a full-stack inventory management app with a production-grade DevOps pipeline featuring automated testing, infrastructure-as-code, and continuous deployment to AWS.

## Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Infrastructure:** AWS ECS Fargate, ECR, S3 (Terraform)
- **CI/CD:** GitHub Actions
- **Testing:** Jest, Vitest, Playwright

## CI/CD Pipeline

Every push to `main` automatically runs:

1. **Lint** — ESLint on frontend and backend (fails fast on bad code)
2. **Test** — Unit and integration tests with coverage reports
3. **Terraform** — Provisions/updates AWS infrastructure
4. **Build & Push** — Docker images built and pushed to ECR
5. **Deploy** — ECS service updated and verified stable

Pull requests run lint + tests before merge is allowed.

## Getting Started Locally

```bash
git clone https://github.com/amathziah/devops.git
cd devops
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Testing

```bash
# Unit + integration
cd server && npm test
cd client && npm test

# E2E
npm run test:e2e
```

## Infrastructure

Defined in `terraform/`. Creates: S3 bucket, ECR repositories, ECS cluster, task definition, service, IAM roles, CloudWatch logs, and security groups — all from code.
