FROM node:20-alpine AS base
ENV PRISMA_SKIP_POSTINSTALL=1

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
COPY . .

# Validate workspace context
RUN echo "🔍 Validating workspace..." && \
    ls -la && \
    test -f pnpm-lock.yaml && \
    test -f pnpm-workspace.yaml && \
    echo "✅ Workspace valid." || \
    (echo "❌ Error: Workspace files (pnpm-lock.yaml, pnpm-workspace.yaml) missing!" && exit 1)

# Install dependencies (incorporating turbo) respecting lockfile
# --prefer-offline: Use cache if available
# --frozen-lockfile: Fail if lockfile triggers updates
RUN pnpm install --ignore-scripts --frozen-lockfile --prefer-offline

# Prune the workspace for the api
# Use the local turbo binary
RUN pnpm exec turbo prune --scope=@kibo/api --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat openssl
RUN apk update
WORKDIR /app

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile --prefer-offline

# Build the project
COPY --from=builder /app/out/full/ .

# Log versions for debugging
RUN echo "🔧 Environment Versions:" && \
    echo "PNPM:" && pnpm -v && \
    echo "Turbo:" && npx turbo --version

# Set Production Environment for Build
ENV NODE_ENV=production

ARG APP_ENV
RUN test -n "$APP_ENV" || (echo "❌ Error: APP_ENV build argument is missing!" && exit 1)
ENV APP_ENV=$APP_ENV

ARG REGION
ARG SERVICE_NAME

# Optional: Log checks (non-blocking if empty, but good for debug)
RUN echo "Building for Service: $SERVICE_NAME in Region: $REGION"

# Generate Prisma Client
# We explicitly specify binary targets via env var to be safe, though schema should handle it
RUN pnpm --filter @kibo/database exec prisma generate

# Build API and verify output immediately
RUN pnpm exec turbo build --filter=@kibo/api...

# Verify build output integrity
RUN echo "🔍 Verifying build output..." && \
    ls -R apps/api/dist && \
    test -f apps/api/dist/main.js && \
    echo "✅ API Build verified." || \
    (echo "❌ Error: main.js missing in apps/api/dist!" && exit 1)

FROM base AS runner
WORKDIR /app

# Install OpenSSL for Prisma Runtime (Critical for Alpine)
RUN apk add --no-cache openssl wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Selective copy for production - Robust & Cleaner
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=installer /app/apps/api/dist ./apps/api/dist

# Explicitly verify main.js exists in the final image
RUN ls -la apps/api/dist/main.js

ENV NODE_ENV=production
ENV PORT=8080

# Native Healthcheck
HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["node", "apps/api/dist/main.js"]
