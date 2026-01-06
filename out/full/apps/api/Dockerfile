# Build stage
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies needed for node-gyp and Prisma
RUN apk add --no-cache libc6-compat openssl openssl-dev

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package.json files for all workspace packages
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/database/prisma ./packages/database/prisma

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl openssl-dev
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy all source code
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma Client
WORKDIR /app
RUN pnpm --filter @kibo/database generate

# Build API
RUN pnpm --filter @kibo/api build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=builder --chown=nestjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "apps/api/dist/main.js"]
