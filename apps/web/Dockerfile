FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/

# copy workspace packages so pnpm can resolve workspace:* deps
COPY packages/core ./packages/core
COPY packages/store ./packages/store
COPY packages/ui-hooks ./packages/ui-hooks

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/web ./apps/web

WORKDIR /app
RUN pnpm --filter web build

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "run", "start"]