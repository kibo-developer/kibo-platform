FROM node:20-alpine

# Add missing system dependency for Prisma
RUN apk add --no-cache openssl

# Global tools
RUN npm install -g pnpm turbo

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter=@kibo/database exec prisma generate
RUN pnpm turbo build --filter=@kibo/api

EXPOSE 8080
CMD ["node", "apps/api/dist/main.js"]
