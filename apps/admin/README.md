<div align="center">
    <img src="../../.github/logo.png" alt="RetroVault Logo" width="300"/>

# RetroVault Admin

### 🛡️ Painel Administrativo construído com Next.js 16 para gestão de usuários, vendas e configurações.

![Status](https://img.shields.io/badge/🚧%20Status-Em%20Desenvolvimento-22C55E?style=for-the-badge&labelColor=161b22&logo=github&logoColor=white)

</div>

<br>
<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind&theme=dark" height="80" />
</p>
<br>

## 📖 Sobre o Admin

Este é o frontend administrativo do RetroVault, desenvolvido com **Next.js 16 (App Router)** e **Tailwind CSS v4**. O painel foi concebido para fornecer aos administradores e vendedores da plataforma o controle completo de operações, monitoramento e relatórios operacionais.

## 🏗️ Estrutura do Projeto

```
admin/
├── src/
│   ├── app/              # App Router (Next.js 16)
│   │   ├── Painel-adm/   # Funcionalidades e visões do administrador global
│   │   ├── Painel-seller/# Funcionalidades e visões do vendedor
│   │   ├── globals.css   # Estilos globais utilizando Tailwind v4
│   │   └── page.tsx      # Landing page / Login do Painel
│   ├── components/       # Componentes de interface do painel
│   └── lib/              # Funções utilitárias e integração de API
├── next.config.ts        # Configuração do Next.js
├── tailwind.config.ts    # Configuração de suporte a estilos
└── package.json          # Dependências do Admin
```

## 🚀 Tecnologias

| Tecnologia | Função |
|-----|------------|
| <img src="https://img.shields.io/badge/Next.js_16-0D1117?style=for-the-badge&logo=nextdotjs&logoColor=white"/> | Framework com renderização híbrida e App Router |
| <img src="https://img.shields.io/badge/React_19-0D1117?style=for-the-badge&logo=react&logoColor=61DAFB"/> | Biblioteca UI com suporte nativo a React Compiler |
| <img src="https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=3178C6"/> | Linguagem de tipagem estática segura |
| <img src="https://img.shields.io/badge/Tailwind_CSS_v4-0D1117?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4"/> | Framework CSS de alta performance utilitário |
| <img src="https://img.shields.io/badge/Zustand-0D1117?style=for-the-badge&logo=react&logoColor=white"/> | Gerenciador de estado global ultraleve |

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## 🛠️ Instalação e Execução

Para executar o painel admin individualmente a partir do monorepo:

```bash
# Na raiz do monorepo, instale as dependências
pnpm install

# Inicie a aplicação admin em modo de desenvolvimento
pnpm --filter=admin dev
```

A aplicação estará disponível em http://localhost:5000.

### Produção

```bash
# Geração do build otimizado
pnpm --filter=admin build

# Inicialização do servidor em produção
pnpm --filter=admin start
```

## 🎨 Funcionalidades Planejadas & Implementadas

- 🔐 **Autenticação Administrativa** com validação de papéis (`ADMIN` / `SELLER`).
- 📊 **Painel Adm** para gerenciamento de usuários, auditorias de segurança e moderação de anúncios.
- 🛍️ **Painel Vendedor (Seller)** para listagem de produtos, upload de mídias físicas, gerenciamento de estoque e envio de pedidos.
- ⚡ **Next.js 16 & React Compiler** integrados para maior performance de renderização.

## 👥 Nossa Equipe

*Consulte a lista completa da equipe no [README principal do projeto](../../README.md).*

---

### Desenvolvido de forma integrada com a arquitetura RetroVault 🚀
