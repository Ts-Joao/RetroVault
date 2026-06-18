FROM node:22-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ packages/

RUN corepack enable && corepack prepare pnpm@9
RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/web apps/web

WORKDIR /app/apps/web

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]