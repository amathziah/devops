# ShopSmart — Inventory Management Platform

An inventory management app used as the payload for the part I actually care about: a
reproducible path from `git push` to running containers on AWS, with nothing done by hand.

Every AWS resource is declared in Terraform — there is no console-clicked state anywhere.
A push to `main` lints, tests, plans and applies infrastructure, builds both images, pushes
them to ECR, then force-redeploys the ECS service and blocks until it reports stable.

> **Note on the live demo:** the AWS stack is torn down between demos — an ALB plus
> Fargate tasks bill by the hour. `terraform apply` recreates the whole environment
> from scratch in a few minutes, which is rather the point of defining it as code.

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

Lint and tests run on every push and pull request. The three jobs that touch AWS --
Terraform, image build and ECS deploy -- run **only from a manual run** of the workflow
(Actions tab, "Run workflow").

That gate exists because it was learned the expensive way, twice. A documentation-only
commit once triggered a full apply, standing up an ALB and Fargate tasks that billed by
the hour. The first fix accepted a marker token in the commit message -- and promptly
fired on the commit that documented the token, because the message contained it. Matching
prose is not a safe trigger for spending money; an explicit button press is.

When a deploy does run, it:

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
│   └── (data.json)       # Local dev store — gitignored, created on first write
├── terraform/            # Infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── e2e/                  # Playwright end-to-end tests
└── .github/workflows/
    └── deploy.yml        # CI/CD pipeline
```

## Design notes and known limits

Things I decided deliberately, and things I would fix next. Stating them is cheaper than
having a reviewer find them.

**Least-privilege IAM.** The ECS task role can call `s3:GetObject` and `s3:PutObject` on
exactly one object — `${bucket}/data.json` — rather than the bucket as a whole. Bucket
versioning and server-side encryption are on, and public access is fully blocked.

**Persistence is a single JSON object in S3.** This is the main weakness. Each mutation
reads the whole document, edits it in memory and writes it back, with no compare-and-swap.
Two concurrent writers both read, both write, and the second silently discards the first —
a textbook lost update. Writes are also O(n) in the dataset.

Two ways out, in increasing order of effort:
1. **Conditional writes.** S3 supports `If-Match` on `PutObject`, so the write can carry the
   ETag read earlier and fail loudly on conflict instead of clobbering. Retry on 412.
2. **DynamoDB.** Per-item reads and writes remove the race and the O(n) rewrite entirely,
   and give real query access. This is the right answer for anything beyond a demo.

**Single-task service.** The ECS service runs one task, so a deploy is a brief interruption
rather than a true rolling update. Raising desired count and adding a deployment circuit
breaker is the fix.

**Secrets.** `JWT_SECRET` is passed as a task environment variable. For anything real it
belongs in Secrets Manager or SSM Parameter Store, referenced by ARN in the task definition.
