FROM node:20-alpine

# Add missing system dependencies for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

# Global tools
RUN npm install -g pnpm turbo

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN npx prisma@5.22.0 generate --schema=packages/database/prisma/schema.prisma
RUN pnpm turbo build --filter=@kibo/api --force

EXPOSE 8080
CMD ["node", "apps/api/dist/main.js"]
