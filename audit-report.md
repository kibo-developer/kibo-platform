# Kibo Platform Cloud Run Audit Report

## 1. Executive Summary
**Can we deploy today?** **NO**

The codebase is largely ready for Cloud Run, but deployment will fail due to a missing build step in the Docker configuration. The Prisma Client is not being generated inside the Docker image, which will cause the API to crash or fail at build time.

## 2. Critical Blockers
| Severity | Component | Issue | Impact |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Dockerfile | **Missing `prisma generate`** | The application will fail to start because `@kibo/database` cannot provide the Prisma Client types or runtime code. |
| **HIGH** | Build Pipeline | **No automated generation** | `turbo build` does not automatically trigger `db:generate`. |

## 3. Code Recommendations

### Fix Dockerfile
Add the generation step *before* the build command.
```dockerfile
# ... existing lines ...
COPY apps/api ./apps/api
COPY packages ./packages

# Install Dependencies
RUN pnpm install --frozen-lockfile

# [ADD THIS LINE] Generate Prisma Client BEFORE build
RUN pnpm --filter=@kibo/database exec prisma generate

# Build the API
RUN pnpm turbo build --filter=@kibo/api
```

### Environment Hygiene
- **PORT:** The app correctly uses `process.env.PORT || 3001` in `apps/api/src/main.ts`.
- **CORS:** Currently set to `app.enableCors()`, which allows everything. This is safe for initial dev but should be restricted to `FRONTEND_URL` in production.
- **Database:** `packages/database` correctly exports the client.

## 4. Environment Variable Map
Required environment variables for Cloud Run (`kibo-api-dev`):

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | Yes | Injected by Cloud Run (default 8080). App supports it. |
| `DATABASE_URL` | Yes | Connection string to Neon Postgres. Must be accessible from Cloud Run. |
| `NODE_ENV` | Yes | Set to `production`. |
| `FRONTEND_URL` | Recommended | For future CORS strictness (currently open). |

## 5. Compilation Diagnostic
- **Local Build (`pnpm turbo build`):** PASSED.
  - *Note:* The local success is likely due to a pre-existing Prisma Client in `node_modules` or local environment state.
- **Docker Simulation:** FAILED (Conceptually).
  - The Docker image starts with a clean `node_modules` and runs `pnpm install`, but **misses** the `prisma generate` step required for `@kibo/database`.
