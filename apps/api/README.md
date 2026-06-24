<div align="center">
    <img src="../../.github/logo.png" alt="RetroVault Logo" width="300"/>

# RetroVault API

### 🔌 API RESTful construída com NestJS para servir aplicações web e mobile.

<br>

![Status](https://img.shields.io/badge/✅%20Status-Completo-22C55E?style=for-the-badge&labelColor=161b22&logo=github&logoColor=white)

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
* **📧 E-mail Transacional (Nodemailer)**:
  * Envio automático de e-mail de boas-vindas ao criar uma nova conta.
  * Fluxo de recuperação de senha com código de 6 dígitos enviado por e-mail, com expiração por tempo.
* **👛 Carteira Digital (Wallet)**:
  * Sistema de saldo virtual para cada usuário da plataforma.
  * Lançamento de créditos (depósitos) via Pix ou Cartão.
  * Histórico e extrato detalhado de movimentações (Entradas/Saídas/Compras).
* **💳 Gateway de Pagamento Simulado (Payment)**:
  * Simulação de fluxos reais para PIX com geração de QR Code escaneável.
  * Geração de código de barras (barcode) para boleto bancário.
  * Tokens para confirmação de pagamentos via cartão de crédito/débito.
  * Roteiro de confirmação e liquidação instantânea de transações.
* **📦 Pedidos & Checkout (Orders)**:
  * Criação e faturamento de pedidos.
  * Integração com a carteira digital para debitar saldos durante compras.
* **⭐ Sistema de Avaliações**:
  * Avaliações habilitadas exclusivamente após a confirmação de entrega do pedido.
  * Notas de satisfação (ratings) vinculadas ao produto e ao vendedor.
* **🚚 Cálculo de Frete (Shipping)**:
  * Simulação dinâmica de preço e prazo (PAC/Sedex) por CEP.
* **🏷️ Catálogo de Produtos & Uploads**:
  * Cadastro de mídias e consoles retrô com upload direto de fotos armazenadas no servidor.
  * Moderação de produtos ativos, busca inteligente e categorias.
* **❤️ Favoritos**: Moderação e listagem de produtos favoritos por usuário.

## 🏗️ Estrutura do Projeto

```
api/
├── prisma/             # Banco de dados (Esquema, Migrations e Seeds)
├── src/                # Código-fonte da aplicação NestJS
│   ├── auth/           # Autenticação via JWT & cookies seguros
│   ├── mail/           # Envio de e-mails transacionais (Nodemailer)
│   ├── wallet/         # Carteira digital (saldo e extrato de movimentações)
│   ├── payment/        # Simulação de pagamentos (Pix/QRCode, Boleto/Barcode, Cartões)
│   ├── orders/         # Pedidos, checkout e integração com wallet
│   ├── ratings/        # Avaliações pós-entrega
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
| <img src="https://img.shields.io/badge/Nodemailer-0D1117?style=for-the-badge&logo=gmail&logoColor=EA4335"/> | Envio de e-mails transacionais (boas-vindas e recuperação de senha) |
| <img src="https://img.shields.io/badge/Swagger-0D1117?style=for-the-badge&logo=swagger&logoColor=85EA2D"/> | Documentação interativa da API |
| <img src="https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=2496ED"/> | Conteinerização do banco de dados e aplicações |

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## 🛠️ Instalação

```bash
# Na raiz do monorepo, instale todas as dependências
pnpm install

# Crie o arquivo .env a partir do exemplo antes de subir qualquer serviço
cp .env.example .env

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

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão com o banco de dados principal |
| `DATABASE_URL_TEST` | Banco de dados exclusivo para testes de integração |
| `JWT_ACCESS_SECRET` | Chave de assinatura dos access tokens |
| `JWT_REFRESH_SECRET` | Chave de assinatura dos refresh tokens |
| `JWT_TOKEN_AUDIENCE` | Audience declarado nos tokens JWT |
| `JWT_TOKEN_ISSUER` | Issuer declarado nos tokens JWT |
| `JWT_TTL` | Tempo de expiração dos tokens em segundos (ex: `3600`) |
| `MAIL_HOST` | Host do servidor SMTP (ex: `smtp.gmail.com`) |
| `MAIL_PORT` | Porta do servidor SMTP (ex: `587`) |
| `MAIL_SECURE` | Usar TLS direto — `true` para porta 465, `false` para STARTTLS |
| `MAIL_USER` | Usuário de autenticação SMTP |
| `MAIL_PASS` | Senha ou App Password do SMTP |
| `MAIL_FROM` | Remetente exibido nos e-mails (ex: `"RetroVault <noreply@exemplo.com>"`) |
| `WEB_URL` | Origem habilitada para CORS (frontend web) |
| `MOBILE_URL` | Origem habilitada para CORS (mobile) |
| `ADMIN_URL` | Origem habilitada para CORS (painel admin) |

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
   > Este comando executa automaticamente a preparação do banco de testes (`pnpm db:test:prepare`), resetando o esquema e garantindo um ambiente limpo para cada suite.

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "@nestjs/core": "^11.0.1",
    "@nestjs/config": "^4.0.4",
    "@nestjs/jwt": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/swagger": "^11.4.4",
    "@prisma/client": "^7.4.1",
    "@prisma/adapter-pg": "^7.4.2",
    "bcrypt": "^6.0.0",
    "class-validator": "^0.15.1",
    "class-transformer": "^0.5.1",
    "cookie-parser": "^1.4.7",
    "multer": "^2.1.1",
    "nodemailer": "^9.0.1",
    "passport-jwt": "^4.0.1",
    "pg": "^8.19.0",
    "slugify": "^1.6.9"
  }
}
```

## 👥 Equipe — API

| Desenvolvedor | Contribuição |
|---|---|
| [João Teixeira](https://github.com/ts-joao) | Arquitetura, modelagem do banco, desenvolvimento completo da API |
| [Lucas Alves](https://github.com/ktzxs) | Desenvolvimento do backend |

---

### Feito cuidadosamente com NestJS 🚀