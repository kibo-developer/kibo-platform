FROM node:20-alpine AS base

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
    (echo "❌ Error: Workspace files missing!" && exit 1)

# Install dependencies (incorporating turbo) respecting lockfile
RUN pnpm install --ignore-scripts --frozen-lockfile --prefer-offline

# Prune the workspace for the web
# Use the local turbo binary
RUN pnpm exec turbo prune --scope=@kibo/web --docker

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

# Validate Build Args
ARG NEXT_PUBLIC_API_URL
RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "❌ Error: NEXT_PUBLIC_API_URL build argument is missing!" && exit 1)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG APP_ENV
RUN test -n "$APP_ENV" || (echo "❌ Error: APP_ENV build argument is missing!" && exit 1)
ENV APP_ENV=$APP_ENV

ARG REGION
ARG SERVICE_NAME

# Optional: Log checks
RUN echo "Building for Service: $SERVICE_NAME in Region: $REGION"

# Generate Prisma Client
RUN pnpm --filter @kibo/database exec prisma generate

# Build Web and verify output
RUN pnpm exec turbo build --filter=@kibo/web...

# Verify output for debugging
RUN echo "🔍 Verifying Next.js build output..." && \
    ls -R apps/web/.next && \
    test -d apps/web/.next && \
    echo "✅ Web Build verified." || \
    (echo "❌ Error: .next folder missing!" && exit 1) 

FROM base AS runner
WORKDIR /app

# Install OpenSSL for Prisma Runtime (Critical for Alpine)
RUN apk add --no-cache openssl wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Native Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

EXPOSE 8080

CMD ["node", "apps/web/server.js"]
