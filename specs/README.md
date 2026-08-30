# Duo - MVP

App para casais registrarem e descobrirem lugares para visitar juntos.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14+ (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Database | MongoDB (Vercel) |
| Auth | NextAuth.js |
| Deploy | Vercel |

## Identidade Visual

| Elemento | Valor |
|----------|-------|
| Primária | `#FF6B6B` (rosa) |
| Secundária | `#4ECDC4` (teal) |
| Fonte | Inter |
| Border Radius | 0.5rem |

## Estrutura

```
specs/
├── design-system/
│   ├── tokens/           # Design tokens (cores, tipografia, espaçamentos, border-radius)
│   └── components/       # Componentes base (button, card, input, badge, etc)
├── components/
│   ├── features/         # Componentes de feature (place-card, place-form, etc)
│   └── layout/           # Componentes de layout (header, logo)
├── pages/                # Páginas do app
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   └── places/
├── api/                  # Rotas API
│   ├── auth/
│   ├── places/
│   ├── couples/
│   └── stats/
├── models/               # Modelos MongoDB
├── lib/                  # Utilitários (mongodb, auth, utils)
├── types/                # Tipos TypeScript
└── config/               # Configurações (tailwind, globals.css)
```

## Setup

```bash
# Criar projeto
npx create-next-app@latest duo --typescript --tailwind --eslint --app --src-dir

# Entrar no projeto
cd duo

# Instalar dependências
npm install next-auth mongodb mongoose bcryptjs
npm install @hookform/resolvers react-hook-form zod
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-slot
npm install @radix-ui/react-tabs @radix-ui/react-tooltip
npm install @radix-ui/react-avatar @radix-ui/react-tabs
npm install lucide-react tailwindcss-animate
npm install -D @types/bcryptjs

# Configurar shadcn
npx shadcn-ui@latest init

# Copiar componentes de specs/ para o projeto
```

## Variáveis de Ambiente

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Funcionalidades

1. **Auth** - Login com Google e Email/Senha
2. **Lugares** - CRUD completo
3. **Dashboard** - Estatísticas e resumo
4. **Filtros** - Buscar, filtrar por categoria e status
