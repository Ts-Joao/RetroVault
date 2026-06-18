FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY packages/core ./packages/core
COPY apps/mobile ./apps/mobile

WORKDIR /app/apps/mobile

EXPOSE 8081

CMD ["pnpm", "start"]