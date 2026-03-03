<div align="center">
    <img src="../.github/logo.png" alt="RetroVault Logo" width="300"/>


# RetroVault API


### 🔌 API RESTful construída com NestJS para servir aplicações web e mobile.

<br>

![Status](https://img.shields.io/badge/🚧%20Status-Em%20Desenvolvimento-22C55E?style=for-the-badge&labelColor=161b22&logo=github&logoColor=white)

</div>

<br>
<p align="center">
  <img src="https://skillicons.dev/icons?i=nestjs,ts,nodejs,postgres,prisma,docker&theme=dark" width="400" />
</p>
<br>

## 📖 Sobre a API
Este é a API RESTful do RetroVault, desenvolvida para centralizar e atender todas as demandas de dados e regras de negócio do ecossistema. Utilizamos TypeScript com NestJS para garantir um backend robusto e escalável.

## 🏗️ Estrutura do Projeto

```
api/
├── prisma/           # Módulos da aplicação
│   ├── migrations/   # Migrations do banco
│   ├── schema.prisma # Schema do prisma
│   └── seed.ts      # Seeds
├── src/              # Pasta source
│   ├── prisma/       # Configuração do Prisma Client
│   ├── app.module.ts # Módulo raiz
│   └── main.ts       # Entry point
├── .env              # Variáveis de ambiente (ignorado pelo git)
├── nest-cli.json     # Configuração do NestJS
└── package.json      # Dependências da API
```

## 🚀 Tecnologias

| Tecnologia | Função |
|-----|------------|
| <img src="https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=00F7FF"/> | Framework principal do Backend |
| <img src="https://img.shields.io/badge/Node.js-0D1117?style=for-the-badge&logo=nodedotjs&logoColor=00FF88"/> | Linguagem com tipagem estática |
| <img src="https://img.shields.io/badge/NestJS-0D1117?style=for-the-badge&logo=nestjs&logoColor=FF0055"/> | Banco de dados relacional |
| <img src="https://img.shields.io/badge/PostgreSQL-0D1117?style=for-the-badge&logo=postgresql&logoColor=00F7FF"/> | ORM e gerenciamento de banco |
| <img src="https://img.shields.io/badge/Prisma-0D1117?style=for-the-badge&logo=prisma&logoColor=2D3748"/> | Gerenciamento do Monorepo |
![Monorepo](https://img.shields.io/badge/Monorepo-0D1117?style=for-the-badge&logo=turborepo&logoColor=white) | Orquestração do Monorepo e Cache de Build

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## 🛠️ Instalação

```bash
# Na raiz do monorepo
pnpm install
# Rodar apenas a API
pnpm --filter=api dev
```

## 🏃 Executando

```bash
# Da raiz do monorepo
pnpm --filter=api dev

# Ou usando turbo
turbo run dev --filter=api
```

A API estará disponível em http://localhost:4000

## Produção
```bash
# Build
pnpm --filter=api build

# Start
pnpm --filter=api start:prod
```

## 🔐 Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://retrovault:retrovault@localhost:5432/retrovault_db?schema=public"
```

## 🗃️ Database
### 📑 Migrations (usando Prisma)
```bash
#Criar migration
pnpm exec prisma migrate dev --name nome_da_migration

# Aplicar migrations
pnpm exec prisma migrate deploy

# Resetar database
pnpm exec prisma migrate reset
```

### 🌱 Seeds
```bash
pnpm --filter=api prisma db seed
```
## 📦 Dependências Principais
```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "@prisma/adapter-pg": "^7.4.2",
    "@prisma/client": "^7.4.1",
    "pg": "^8.19.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  }
}
```

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

---

### Feito cuidadosamente com NestJS 🚀