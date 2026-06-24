<div align="center">
    <img src=".github/logo.png" alt="RetroVault Logo" width="300"/>

# RetroVault

### 📦 Monorepo com API, Web, Admin e Mobile
Marketplace retrô focado em mídia física e colecionáveis.

</div>

## 📖 Sobre o projeto

Este é um projeto desenvolvido para a disciplina de Projeto Integrador. Durante o nosso **brainstorm**, identificamos a carência de e-commerces focados em **mídia física**, o que dificulta a jornada de fãs e colecionadores em busca de itens específicos. RetroVault surge como um marketplace com temática retrô, onde usuários podem comprar e vender produtos, celebrando o início da indústria do entretenimento.

<br>

## 🏗️ Estrutura do Projeto

Este projeto utiliza **arquitetura monorepo** com separação clara de responsabilidades:

```
RetroVault/
├── apps/
│   ├── api/        # Backend (NestJS)
│   ├── web/        # Frontend (Next.js)
│   ├── admin/      # Painel Administrativo (Next.js)
│   └── mobile/     # Mobile (Expo)
├── packages/
│   └── shared/     # Tipos e interfaces compartilhadas
├── turbo.json
└── package.json
```

## 🚀 Aplicações

| Aplicação | Stack | Porta |
|-----------|--------|--------|
| [`api`](apps/api) | NestJS + TypeScript | 4000 |
| [`web`](apps/web) | Next.js + TypeScript + Tailwind | 3000 |
| [`admin`](apps/admin) | Next.js + TypeScript + Tailwind | 5000 |
| [`mobile`](apps/mobile) | Expo + TypeScript | 8081 |

## 🧱 Stack Principal

<br>
<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,nextjs,nodejs,nestjs,react&theme=dark" width="300" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/turborepo/EF4444" height="45" alt="Turborepo"/>
</p>
<br>

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

```bash
npm install -g pnpm
```

## 🛠️ Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/ts-joao/RetroVault.git
cd RetroVault
pnpm install
```

## 💻 Rodando o projeto

### Todos os apps ao mesmo tempo

```bash
pnpm dev
```

### Apps separados (recomendado)

```bash
# Backend
pnpm dev --filter=api

# Frontend Web
pnpm dev --filter=web

# Painel Administrativo
pnpm dev --filter=admin

# Mobile
pnpm dev --filter=mobile
```

### 🐳 Rodando com Docker

O monorepo está totalmente conteinerizado e configurado para subir todos os serviços e bancos de dados integrados via Docker Compose.

> **⚠️ Antes de rodar:** cada aplicação precisa de um arquivo `.env` próprio. Copie o `.env.example` de cada diretório e preencha os valores:
> ```bash
> cp apps/api/.env.example apps/api/.env
> cp apps/web/.env.example apps/web/.env
> cp apps/admin/.env.example apps/admin/.env
> cp apps/mobile/.env.example apps/mobile/.env
> ```

```bash
# Para construir e subir todos os serviços (api, web, admin, mobile, postgres)
docker compose up --build

# Para subir apenas o banco de dados (útil ao rodar os serviços locais fora do Docker)
docker compose up -d postgres
```

| Serviço no Docker | Porta Host | Porta Container |
|-------------------|------------|-----------------|
| `api` | 4000 | 4000 |
| `web` | 3000 | 3000 |
| `admin` | 5000 | 3000 |
| `mobile` | 8081 | 8081 |
| `postgres` | 5432 | 5432 |
| `postgres-test` | 5433 | 5432 |

## 🧪 Integração Contínua (CI) & Testes

Nossa pipeline de Integração Contínua está configurada com GitHub Actions (em [`.github/workflows/ci.yml`](.github/workflows/ci.yml)) para garantir a estabilidade das entregas a cada push e pull request nas branches `main` e `develop`.

### O que o CI executa:
1. **Ambiente Isolado:** Sobe um container PostgreSQL temporário na porta `5433` específico para testes.
2. **Dependências:** Instala dependências usando cache do `pnpm`.
3. **Migrações:** Executa o Prisma Client e empurra as definições do esquema para o banco de teste (`prisma db push`).
4. **Testes E2E:** Roda toda a suite de testes ponta a ponta (End-to-End) do backend:
   ```bash
   pnpm test:e2e
   ```

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Roda todos os apps em modo desenvolvimento |
| `pnpm build` | Gera o build de todos os apps |
| `pnpm lint` | Roda o linter em todos os apps |
| `pnpm test:e2e` | Roda os testes E2E no backend |

## ⛓️ Fluxo de trabalho com Git

### Branches

| Branch | Descrição |
|--------|-----------|
| `main` | Produção — nunca commitar direto |
| `develop` | Integração de features |

## 👥 Nossa Equipe

### [João Teixeira](https://github.com/ts-joao)
**Tech Lead & Fullstack Developer**
- 🏗️ **Arquitetura:** Responsável pela estrutura e organização da arquitetura do projeto.
- 🗄️ **Database:** Realizou a modelagem completa do banco de dados.
- 👨‍💻 **API:** Desenvolveu o backend completo (auth, wallet, pagamentos, pedidos, e-mail, Swagger).
- 🌐 **Web:** Atuou no desenvolvimento da interface web.
- 📱 **Mobile:** Atuou no desenvolvimento do aplicativo mobile.

### [Baruki Bytes](https://github.com/Baruki-Bytes)
**Project Owner & Fullstack Developer**
- 📑 **Gestão:** Responsável pela visão do produto (PO) e requisitos.
- 🌐 **Web:** Desenvolveu a interface web do projeto.
- 🛡️ **Admin:** Desenvolveu o painel administrativo.

### [Felipe Farias](https://github.com/felipinho3105)
**Frontend Developer**
- 🌐 **Web:** Auxiliou no desenvolvimento da interface web, com foco em responsividade.
- 📱 **Mobile:** Auxiliou no desenvolvimento mobile, com foco em responsividade.

### [Lucas Alves](https://github.com/ktzxs)
**Fullstack Developer**
- 👨‍💻 **API:** Atuou no desenvolvimento do backend.
- 📱 **Mobile:** Desenvolveu o aplicativo mobile.

### [Luiz Henrique](https://github.com/troninho69)
**Fullstack Developer**
- 📱 **Mobile:** Desenvolveu o Frontend Mobile e auxiliou no desenvolvimento da API.