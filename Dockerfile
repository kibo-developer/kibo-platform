# Base Setup
FROM node:20-alpine

# Add missing system dependencies for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm turbo
WORKDIR /app

# Copy Monorepo Configs
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy Source Code
COPY apps/api ./apps/api
COPY packages ./packages

# Install Dependencies (Frozen for consistency)
RUN pnpm install --frozen-lockfile

# Build the API specifically (using Turbo logic)
# This ensures we don't waste time building the Next.js frontend
RUN pnpm turbo build --filter=@kibo/api

# Expose Cloud Run Port
EXPOSE 8080

# START COMMAND
# Direct node execution for signal handling
CMD ["node", "apps/api/dist/main.js"]
