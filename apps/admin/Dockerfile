FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin/package.json ./apps/admin/

# copy workspace packages so pnpm can resolve workspace:* deps
COPY packages/core ./packages/core
COPY packages/store ./packages/store

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/admin ./apps/admin

WORKDIR /app
RUN pnpm --filter admin build

EXPOSE 3000
CMD ["pnpm", "--filter", "admin", "run", "dev"]