<div align="center">
    <img src="../../.github/logo.png" alt="RetroVault Logo" width="300"/>

# RetroVault Web

### 🌐 Aplicação Web construída com Next.js para uma experiência moderna e responsiva.

![Status](https://img.shields.io/badge/✅%20Status-Completo-22C55E?style=for-the-badge&labelColor=161b22&logo=github&logoColor=white)

</div>

<br>
<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind&theme=dark" height="80" />
</p>
<br>

## 📖 Sobre o Web

Este é o frontend web do RetroVault, desenvolvido com **Next.js 16**, **React 19** e **Tailwind CSS v4**. Nossa aplicação oferece uma interface moderna, responsiva e otimizada para performance, permitindo aos usuários acessar todo o ecossistema RetroVault através do navegador.

## 🏗️ Estrutura do Projeto

```
web/
├── src/
│   ├── app/              # App Router
│   │   └── page.tsx      # Página inicial
│   ├── components/       # Componentes reutilizáveis
│   ├── lib/             # Utilitários, contextos e serviços (separados em .client e .server)
│   ├── hooks/           # Custom hooks
│   ├── types/           # Tipos TypeScript
│   └── styles/          # Estilos globais
├── public/              # Arquivos estáticos
├── next.config.ts       # Configuração do Next.js
└── package.json         # Dependências do Web
```

## 🚀 Tecnologias

| Tecnologia | Função |
|-----|------------|
| <img src="https://img.shields.io/badge/Next.js_16-0D1117?style=for-the-badge&logo=nextdotjs&logoColor=white"/> | Framework React com SSR, App Router e Turbopack |
| <img src="https://img.shields.io/badge/React_19-0D1117?style=for-the-badge&logo=react&logoColor=61DAFB"/> | Biblioteca para construção de interfaces |
| <img src="https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=3178C6"/> | Linguagem com tipagem estática |
| <img src="https://img.shields.io/badge/Tailwind_CSS_v4-0D1117?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4"/> | Framework CSS de nova geração ultra-rápido |
| ![Monorepo](https://img.shields.io/badge/Monorepo-0D1117?style=for-the-badge&logo=turborepo&logoColor=white) | Orquestração do Monorepo e Cache de Build |

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## 🛠️ Instalação

```bash
# Na raiz do monorepo
pnpm install

# Rodar apenas o Web
pnpm --filter=web dev
```

## 🏃 Executando

```bash
# Da raiz do monorepo
pnpm --filter=web dev

# Ou usando turbo
turbo run dev --filter=web
```

A aplicação estará disponível em http://localhost:3000

### Produção
```bash
# Build
pnpm --filter=web build

# Start
pnpm --filter=web start
```

## 🎨 Features

- ✅ **Next.js 16 & React 19** — Estrutura moderna e alto desempenho
- ✅ **App Router** — Roteamento moderno baseado em arquivos
- ✅ **Server Components** — Renderização otimizada no servidor para SEO e performance
- ✅ **Separação de Serviços** — Serviços divididos logicamente entre escopos `.client` e `.server`
- ✅ **Tailwind CSS v4** — Estilização moderna e otimizada por padrão
- ✅ **Responsive** — Design totalmente adaptável para todos os dispositivos
- ✅ **Zustand** — Gerenciamento de estado global otimizado

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwindcss": "^4",
    "typescript": "^5",
    "axios": "^1.16.0",
    "zustand": "^4.5.0"
  }
}
```

## 👥 Equipe — Web

| Desenvolvedor | Contribuição |
|---|---|
| [João Teixeira](https://github.com/ts-joao) | Desenvolvimento da interface web e integração com a API |
| [Baruki Bytes](https://github.com/Baruki-Bytes) | Desenvolvimento da interface web |
| [Felipe Farias](https://github.com/felipinho3105) | Responsividade e ajustes de interface |

---

### Feito cuidadosamente com Next.js 🚀