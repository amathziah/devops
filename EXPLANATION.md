# ShopSmart — Architecture, Workflow & Design Decisions

## 1. System Architecture

ShopSmart is a full-stack e-commerce app using a three-tier architecture:

```
React Frontend (client/)
       │
       │ REST API (HTTP)
       ▼
Node.js / Express Backend (server/)
       │
       │ JSON file storage
       ▼
   Local Disk (no external DB)
```

Both frontend and backend run as Docker containers on **AWS ECS Fargate** — a serverless container platform where AWS manages the underlying servers.

---

## 2. Infrastructure (Terraform)

All AWS infrastructure is defined as code in `terraform/main.tf`. Running `terraform apply` creates:

| Resource | Purpose |
|---|---|
| S3 Bucket | Rubric requirement; versioning + AES256 encryption + public access blocked |
| ECR (x2) | Private Docker registries for backend and frontend images |
| ECS Cluster | Logical grouping for the Fargate service |
| ECS Task Definition | Declares both containers, CPU/memory, health checks, log config |
| ECS Service | Keeps 1 task running; auto-restarts on failure |
| IAM Role | Allows ECS to pull images from ECR and write logs |
| Security Group | Opens port 5000 (backend) and 80 (frontend) |
| CloudWatch Log Group | Captures container stdout/stderr logs |

**Terraform state** is stored in an S3 bucket (`shopsmart-tfstate-008165007254`) so state persists between pipeline runs. Each CI run imports already-existing resources before planning, making Terraform idempotent — running it twice produces the same result.

---

## 3. CI/CD Pipeline (GitHub Actions)

File: `.github/workflows/deploy.yml`

Triggers on every `push` and `pull_request` to `main`.

```
push / PR to main
       │
       ▼
   [lint]  ← fails PR if ESLint finds errors
       │
       ▼
   [test]  ← unit + integration tests, uploads coverage artifacts
       │
       ▼ (main branch only)
   [terraform]  ← init → import existing → validate → plan → apply
       │
       ▼
   [build-push]  ← docker build → ECR login → push backend + frontend images
       │
       ▼
   [deploy]  ← ECS update-service --force-new-deployment → wait for stable
```

Each job only runs if the previous one succeeds. Tests and lint run on PRs too, so broken code can never be merged.

---

## 4. Docker (Multi-Stage Builds)

**Backend** (`server/Dockerfile`):
- Stage 1 (`builder`): installs all deps including devDependencies
- Stage 2 (`run`): copies only `node_modules` + `src/`, runs as non-root user `nodejs`
- HEALTHCHECK hits `/health` endpoint every 30s

**Frontend** (`client/Dockerfile`):
- Stage 1 (`builder`): installs deps and runs `npm run build` to produce static files
- Stage 2: serves static files via `nginx:alpine`, runs as non-root user `staticuser`
- HEALTHCHECK hits nginx on port 80 every 30s

Multi-stage builds keep final images small (no build tools in production image).

---

## 5. Testing Strategy

| Layer | Tool | What it tests |
|---|---|---|
| Unit | Jest (backend), Vitest (frontend) | Individual functions and components in isolation |
| Integration | Jest + Supertest | API routes interacting with the data layer end-to-end |
| E2E | Playwright | Full user flows in a real browser (login, browse, checkout) |

Coverage reports are uploaded as GitHub Actions artifacts on every run.

---

## 6. PR Checks & Linting

ESLint runs on every push and pull request. The workflow fails if any lint error is found (`--max-warnings 0`), preventing bad code from merging. Prettier enforces consistent formatting.

---

## 7. Dependabot

`.github/dependabot.yml` checks for outdated npm packages in `/client` and `/server` weekly, and also updates GitHub Actions versions. It opens automated PRs when newer versions are available, which then trigger the lint + test pipeline automatically.

---

## 8. Idempotency

All scripts and pipeline steps are safe to run multiple times:

- `aws s3 mb ... || true` — won't fail if bucket already exists
- `terraform import ... 2>/dev/null || true` — won't fail if resource isn't in AWS yet or already in state
- `terraform apply` with S3 backend — reads existing state and only changes what's different
- ECS `update-service --force-new-deployment` — safely replaces running tasks with new image

---

## 9. Challenges & Solutions

| Challenge | Solution |
|---|---|
| Terraform had no memory between CI runs | Added S3 backend to persist state file |
| Resources created in run #1 blocked run #2 | Added `terraform import` for each resource before planning |
| `random_id` generated new names each run | Switched to fixed bucket name using AWS account ID |
| ECR URL empty when passed between jobs | Hardcoded deterministic ECR URL instead of relying on job outputs |
| Session token not needed for IAM user | Removed `aws-session-token` from all credential steps |
