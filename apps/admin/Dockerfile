FROM node:22-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin/package.json apps/admin/package.json

RUN corepack enable && corepack prepare pnpm@9
RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/admin apps/admin

WORKDIR /app/apps/admin

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
