<div align="center">
    <img src="../../.github/logo.png" alt="RetroVault Logo" width="300"/>


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
Esta é a API RESTful do RetroVault, desenvolvida para centralizar e atender todas as demandas de dados e regras de negócio do ecossistema. Utilizamos TypeScript com NestJS para garantir um backend robusto e de alta performance.

## 📄 Documentação da API (Swagger)

A API possui documentação interativa integrada com Swagger. Ao rodar o backend localmente ou em produção, a documentação pode ser acessada em:

```
http://localhost:4000/api/docs
```

O painel expõe todos os endpoints disponíveis, esquemas de dados de requisição/resposta e suporte para testes diretos com autenticação Bearer JWT.

## 🎨 Funcionalidades do Backend

A API implementa as principais regras de negócio da plataforma RetroVault:

* **🔐 Autenticação Robusta**: Login e renovação de sessões utilizando JWT e Refresh Tokens criptografados, trafegados via Cookies `HTTP-only` seguros.
* **👛 Carteira Digital (Wallet)**:
  * Sistema de saldo virtual para cada usuário da plataforma.
  * Lançamento de créditos (depósitos) via Pix ou Cartão.
  * Histórico e extrato detalhado de movimentações (Entradas/Saídas/Compras).
* **💳 Gateway de Pagamento Simulado (Payment)**:
  * Simulação de fluxos reais para PIX (gerando chaves estéticas/QR Codes reais).
  * Geração de linhas digitáveis para boleto e tokens para cartões de crédito/débito.
  * Roteiro de confirmação e liquidação instantânea de transações.
* **📦 Pedidos & Checkout (Orders)**:
  * Criação e faturamento de pedidos.
  * Integração com a carteira digital para debitar saldos durante compras.
* **🚚 Cálculo de Frete (Shipping)**:
  * Simulação dinâmica de preço e prazo (PAC/Sedex) por CEP.
* **🏷️ Catálogo de Produtos & Uploads**:
  * Cadastro de mídias e consoles retrô com upload direto de fotos armazenadas no servidor.
  * Moderação de produtos ativos, busca inteligente e categorias.
* **⭐ Avaliações & Favoritos**: Sistema de notas de satisfação (ratings) e moderação de favoritos.

## 🏗️ Estrutura do Projeto

```
api/
├── prisma/             # Banco de dados (Esquema, Migrations e Seeds)
├── src/                # Código-fonte da aplicação NestJS
│   ├── auth/           # Autenticação via JWT & cookies seguros
│   ├── wallet/         # Carteira digital (saldo e extrato de movimentações)
│   ├── payment/        # Simulação de pagamentos (Pix, Boleto, Cartões)
│   ├── app.module.ts   # Módulo raiz do sistema
│   └── main.ts         # Ponto de entrada (CORS, prefixo de rotas e Swagger)
└── test/               # Suite de testes End-to-End (E2E)
```

## 🚀 Tecnologias

| Tecnologia | Função |
|-----|------------|
| <img src="https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=3178C6"/> | Linguagem com tipagem estática e superset JavaScript |
| <img src="https://img.shields.io/badge/NestJS_11-0D1117?style=for-the-badge&logo=nestjs&logoColor=E0234E"/> | Framework modular do Backend RESTful |
| <img src="https://img.shields.io/badge/PostgreSQL-0D1117?style=for-the-badge&logo=postgresql&logoColor=4169E1"/> | Banco de dados relacional (Produção, Dev e Testes) |
| <img src="https://img.shields.io/badge/Prisma_7-0D1117?style=for-the-badge&logo=prisma&logoColor=2D3748"/> | ORM moderno e type-safe para comunicação com o banco |
| <img src="https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=2496ED"/> | Conteinerização do banco de dados e aplicações |

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## 🛠️ Instalação

```bash
# Na raiz do monorepo, instale todas as dependências
pnpm install

# Inicialize o banco de dados PostgreSQL usando Docker
docker compose up -d postgres
```

## 🏃 Executando Localmente

```bash
# Rodar apenas a API em desenvolvimento (com Hot Reload)
pnpm --filter=api dev
```

A API estará disponível em http://localhost:4000. O Swagger em http://localhost:4000/api/docs.

### Produção
```bash
# Build
pnpm --filter=api build

# Start Prod
pnpm --filter=api start:prod
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` no diretório `apps/api` copiando o modelo de exemplo:

```bash
cp .env.example .env
```

Campos no `.env`:
* `DATABASE_URL`: String de conexão com o banco de dados relacional principal.
* `DATABASE_URL_TEST`: Banco de dados exclusivo para testes de integração.
* `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Chaves de assinatura dos tokens de autenticação.
* `JWT_TTL`: Tempo de expiração (Time-To-Live) dos tokens.
* `WEB_URL` / `MOBILE_URL` / `ADMIN_URL`: Origens habilitadas para controle de CORS.

## 🗃️ Database

### 📑 Migrations (usando Prisma)
```bash
# Criar e aplicar uma nova migration em ambiente de desenvolvimento
pnpm --filter=api exec prisma migrate dev --name nome_da_migration

# Aplicar migrations pendentes no banco de dados
pnpm --filter=api exec prisma migrate deploy

# Resetar o banco (apaga dados e reaplica migrações + seed)
pnpm --filter=api exec prisma migrate reset
```

### 🌱 Seeds (Carga Inicial)
```bash
pnpm --filter=api prisma db seed
```

## 🧪 Testes E2E (End-to-End)

Temos uma suíte de testes automatizados ponta-a-ponta rodando com **Jest** e **Supertest** para cobrir todas as rotas e regras de negócios importantes da API.

### Como rodar localmente:

1. Suba o banco de dados específico para testes:
   ```bash
   docker compose up -d postgres-test
   ```
2. Execute o comando de testes:
   ```bash
   pnpm --filter=api test:e2e
   ```
   *Nota: Este comando executa automaticamente a preparação do banco de testes (`pnpm db:test:prepare`), resetando o esquema e garantindo um ambiente limpo para cada suite de testes.*

## 📦 Dependências Principais

Abaixo estão listadas as dependências de maior destaque no `package.json`:

```json
{
  "dependencies": {
    "@nestjs/core": "^11.0.1",
    "@nestjs/swagger": "^11.4.4",
    "@prisma/client": "^7.4.1",
    "bcrypt": "^6.0.0",
    "passport-jwt": "^4.0.1"
  }
}
```

---

### Feito cuidadosamente com NestJS 🚀