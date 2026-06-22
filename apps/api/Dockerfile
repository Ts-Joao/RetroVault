FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY packages/core ./packages/core
COPY apps/api ./apps/api

WORKDIR /app/apps/api

RUN pnpm prisma generate

RUN mkdir -p uploads/profiles uploads/products
RUN chmod -R 777 uploads

EXPOSE 4000
CMD ["pnpm", "--filter", "api", "run", "dev"]