# Kibo Platform

Kibo Platform is a monorepo application built with the T3 stack philosophy, customized for Google Cloud Run deployment.

## 🏗 Architecture

- **Monorepo Manager**: [Turborepo](https://turbo.build/) + [PNPM](https://pnpm.io/)
- **Apps**:
  - `apps/web`: Next.js 15 (App Router) Frontend.
  - `apps/api`: NestJS Backend.
- **Packages**:
  - `packages/database`: Shared Prisma Client + Zod schemas (connected to Neon Postgres).

## 🚀 Infrastructure

- **Cloud Provider**: Google Cloud Platform (GCP).
- **Compute**: Cloud Run (Serverless Containers).
- **CI/CD**: GitHub Actions (Builds & Deploys to Cloud Run).
- **Database**: Neon (Serverless Postgres).
- **Secrets**: Google Secret Manager.

## 🛠 Development

### Prerequisites
- Node.js 20+
- PNPM (`npm i -g pnpm`)
- Docker (optional, for local container testing)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Generate Prisma Client:
   ```bash
   pnpm db:generate
   ```

3. Start Development Server:
   ```bash
   pnpm dev
   ```
   - API: http://localhost:3001
   - Web: http://localhost:3000

## 📦 Deployment

Deployment is automated via GitHub Actions in `.github/workflows/deploy.yml`.

- **Trigger**: Push to `main`.
- **Selective Deploy**: Only deploys the service (`api` or `web`) that has changed.
- **Manual Trigger**: Commit messages containing `[deploy-api]`, `[deploy-web]`, or `[deploy-all]`.

## 📁 Directory Structure

```
.
├── apps/
│   ├── api/          # NestJS application
│   └── web/          # Next.js application
├── packages/
│   ├── database/     # Prisma schema & client
├── .github/
│   └── workflows/    # CI/CD pipelines
```
