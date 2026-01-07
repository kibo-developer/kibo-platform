FROM node:20-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install turbo --global
COPY . .

# Prune the workspace for the api
RUN turbo prune --scope=@kibo/api --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat openssl
RUN apk update
WORKDIR /app

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .

# Generate Prisma Client
# We explicitly specify binary targets via env var to be safe, though schema should handle it
RUN pnpm --filter @kibo/database exec prisma generate

RUN pnpm turbo build --filter=@kibo/api...

# Debug: Verify that the build output exists
RUN ls -la apps/api/dist

FROM base AS runner
WORKDIR /app

# Install OpenSSL for Prisma Runtime (Critical for Alpine)
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the entire app from installer (simple but effective for monorepo)
# Ensure we have the dist folder
COPY --from=installer /app .

# Explicitly verify main.js exists in the final image
RUN ls -la apps/api/dist/main.js

CMD ["node", "apps/api/dist/main.js"]
