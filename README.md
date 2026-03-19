# ShopSmart — Premium Inventory Management Platform

ShopSmart is a modern, full-stack inventory management solution designed for speed, reliability, and visual excellence. Built with a production-grade DevOps pipeline, it features automated deployments, containerized service management, and comprehensive end-to-end testing.

## 🚀 Key Features

- **Inventory Tracking:** Real-time CRUD operations for managing business assets.
- **Premium UI/UX:** A stunning, dark-mode-first design with glassmorphism, smooth animations, and a focus on visual hierarchy.
- **Secure Authentication:** Integrated JWT-based auth flow with protected routes and personalized sessions.
- **Automated DevOps:** Consolidated GitHub Actions pipeline for linting, testing, Docker builds, and EC2 deployments.
- **High-Availability:** Managed via PM2 for zero-downtime serving of both Backend and Frontend.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Vanilla CSS (Premium Custom Styles).
- **Backend:** Node.js, Express.
- **Testing:** Vitest (Unit/Integration), Playwright (End-to-End).
- **DevOps:** GitHub Actions, Docker, PM2, SSH/SCP Automation.
- **Cloud:** AWS EC2.

## 📦 Getting Started

### Prerequisites
- Node.js (v20.x recommended)
- Git

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amathziah/devops.git
   cd devops
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start the Development Servers:**
   ```bash
   npm run dev
   ```
   The backend will start on [http://localhost:5001](http://localhost:5001) and the frontend on [http://localhost:5173](http://localhost:5173).

## 🧪 Testing

We maintain high quality through a multi-layered testing strategy:

- **Frontend:** `cd client && npm test`
- **Backend:** `cd server && npm test`
- **E2E:** `npm run test:e2e` (Run `npx playwright test --ui` for interactive mode)

## 🚢 Deployment

The project is fully automated. Simply push to the `main` branch to trigger:
1. **Linting & Unit Tests**
2. **End-to-End Tests**
3. **Docker Image Build & Push** (GHCR)
4. **Production Deployment** to AWS EC2 using the optimized `production-deploy.yml`.

## 📈 Monitoring & Scalability

The project includes pre-configured monitoring and orchestration templates:
- **Prometheus/Grafana:** See `/monitoring`.
- **Kubernetes:** Manifests located in `/k8s`.

---
*Built with ❤️ by Antigravity*
