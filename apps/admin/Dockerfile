FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY packages/core ./packages/core
COPY apps/admin ./apps/admin

WORKDIR /app/apps/admin
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "dev"]