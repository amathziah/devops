# Local Testing Guide

To verify your changes before pushing to GitHub, you can run the following test suites locally.

## 1. Frontend Unit & Integration Tests (Vitest)
These tests verify individual UI components and the `AuthContext` logic.
```bash
cd client
npm test                 # Run in watch mode (interactive)
npm test -- --run        # Run once (CI style)
npm test -- --coverage   # Check test coverage report
```

## 2. Backend Unit & Integration Tests (Jest)
These tests verify API endpoints, database interactions, and business logic.
```bash
cd server
npm test                 # Run all tests
npm test -- --coverage   # Check backend coverage
```

## 3. End-to-End Tests (Playwright)
These track the real user journeys (Login -> Add Item -> Delete Item) across the full stack.
**Prerequisites:** Your backend should be running on Port 3000 (or the test will start its own if configured, but it's best to have it live).
```bash
# From the root directory:
npm run test:e2e             # Run tests in headless mode
npx playwright test --ui     # Open the interactive UI (Highly recommended!)
```

## 4. Useful Root Commands
We've added scripts to your root `package.json` to manage the whole project:
```bash
npm run install:all    # Install dependencies for root, client, and server
npm run dev            # Start both frontend and backend in dev mode
```

> [!TIP]
> **Pro Interview Tip:** If asked how you ensure quality, mention that you run **Unit Tests** for fast feedback on logic and **E2E Tests** to ensure the entire system (Frontend + Backend + DB) works together seamlessly.
