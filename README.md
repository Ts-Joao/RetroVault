# RetroVault

Monorepo do projeto RetroVault, contendo o app mobile, web e a API backend.

## 🏗️ Estrutura do Projeto

```
RetroVault/
├── apps/
│   ├── api/        # Backend (NestJS) → http://localhost:4000
│   ├── web/        # Frontend (Next.js) → http://localhost:3000
│   └── mobile/     # Mobile (Expo) → http://localhost:8081
├── packages/
│   └── shared/     # Tipos e interfaces compartilhadas
├── turbo.json
└── package.json
```

## 🚀 Tecnologias

| App | Tecnologia |
|-----|------------|
| `api` | NestJS + TypeScript |
| `web` | Next.js + TypeScript + Tailwind |
| `mobile` | Expo + TypeScript |
| Monorepo | Turborepo + pnpm |

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

# Frontend
pnpm dev --filter=web

# Mobile
pnpm dev --filter=mobile
```

## 📦 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Roda todos os apps em modo desenvolvimento |
| `pnpm build` | Gera o build de todos os apps |
| `pnpm lint` | Roda o linter em todos os apps |

## 🌿 Fluxo de trabalho com Git

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
- 👨‍💻 **Desenvolvimento:** Desenvolveu a API, realizou a integração entre Back e Front, e atuou no desenvolvimento Web e Mobile.
  
### [Baruki Bytes](https://github.com/Baruki-Bytes)
**Project Owner & Fullstack Developer**
- 📑 **Gestão:** Responsável pela visão do produto (PO) e requisitos.
- 👨‍💻 **Desenvolvimento:** Desenvolveu a interface Web e auxiliou no desenvolvimento Backend.

### [Felipe Farias](https://github.com/felipinho3105)
**Frontend Developer**
- 👨‍💻 **Desenvolvimento:** Desenvolveu a interface Web do projeto e auxiliou no desenvolvimento Mobile.

### [Lucas Alves](https://github.com/ktzxs)
**Fullstack Developer**
- 👨‍💻 **Desenvolvimento:** Desenvolveu o Backend e auxiliou no desenvolvimento Frontend Mobile.

### [Luiz Henrique](https://github.com/troninho69)
**Fullstack Developer**
- 👨‍💻 **Desenvolvimento:** Desenvolveu o Frontend Mobile e axiliou no desenvolvimento da API.
