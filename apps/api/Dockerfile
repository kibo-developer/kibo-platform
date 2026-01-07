FROM node:20-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
# Install turbo locally in the root as a dev dependency (respecting lockfile)
RUN pnpm install turbo --workspace-root --config.ignore-scripts=true
COPY . .

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
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

# Generate Prisma Client
# We explicitly specify binary targets via env var to be safe, though schema should handle it
RUN pnpm --filter @kibo/database exec prisma generate

# Build API and verify output immediately
RUN pnpm exec turbo build --filter=@kibo/api...
RUN echo "listing api dist contents:" && ls -R apps/api/dist

FROM base AS runner
WORKDIR /app

# Install OpenSSL for Prisma Runtime (Critical for Alpine)
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Selective copy for production - Robust & Cleaner
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer /app/apps/api/dist ./apps/api/dist

# Explicitly verify main.js exists in the final image
RUN ls -la apps/api/dist/main.js

CMD ["node", "apps/api/dist/main.js"]
