FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 4000
CMD ["pnpm", "dev"]