FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/mobile/package.json ./apps/mobile/

# copy workspace packages so pnpm can resolve workspace:* deps
COPY packages/core ./packages/core
COPY packages/store ./packages/store
COPY packages/ui-hooks ./packages/ui-hooks

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/mobile ./apps/mobile

WORKDIR /app/apps/mobile

EXPOSE 8081

CMD ["pnpm", "--filter", "mobile", "run", "dev"]