FROM node:22-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/mobile/package.json apps/mobile/package.json

RUN corepack enable && corepack prepare pnpm@9
RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/mobile apps/mobile

WORKDIR /app/apps/mobile

# RUN pnpm start

EXPOSE 8081

CMD ["pnpm", "dev"]