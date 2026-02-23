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
git clone https://github.com/seu-usuario/RetroVault.git
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
| `pnpm format` | Formata o código com Prettier |

## 🌿 Fluxo de trabalho com Git

### Branches

| Branch | Descrição |
|--------|-----------|
| `main` | Produção — nunca commitar direto |
| `develop` | Integração de features |
| `feature/nome` | Nova funcionalidade |
| `hotfix/nome` | Correção urgente em produção |

### Criando uma feature

```bash
# 1. Sempre parta da branch develop atualizada
git checkout develop
git pull origin develop

# 2. Crie sua branch
git checkout -b feature/nome-da-feature

# 3. Faça seus commits
git add .
git commit -m "feat(web): adiciona tela de login"

# 4. Suba a branch e abra um Pull Request para develop
git push origin feature/nome-da-feature
```

### Padrão de commits (Conventional Commits)

```
feat(escopo):     nova funcionalidade
fix(escopo):      correção de bug
chore(escopo):    atualização de dependências, configs
docs:             documentação
refactor(escopo): refatoração sem mudança de comportamento
test(escopo):     adição ou correção de testes
style(escopo):    formatação, sem mudança de lógica
```

**Exemplos:**

```bash
git commit -m "feat(api): adiciona endpoint de autenticação"
git commit -m "fix(mobile): corrige navegação na tela inicial"
git commit -m "chore: atualiza dependências do projeto"
```

## 📁 Pacote Shared

O pacote `packages/shared` centraliza tipos e interfaces usados por todos os apps. Qualquer alteração no contrato da API deve ser feita aqui.

```ts
// packages/shared/src/index.ts
export interface User {
  id: string
  name: string
  email: string
}
```

Para usar em qualquer app:

```ts
import { User } from '@retrovault/shared'
```

## 👥 Time

| Nome | Área |
|------|------|
| — | Backend |
| — | Backend |
| — | Frontend |
| — | Mobile |
| — | Mobile |