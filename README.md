# Duo

App para casais registrarem e descobrirem lugares para visitar juntos.

## Funcionalidades

- **Autenticação** - Login e registro com email/senha (NextAuth)
- **Sistema de Duplas (Duo)** - Conectar com seu parceiro via código de convite
- **Lugares** - Criar, editar, excluir e visualizar lugares
- **Avaliação por Estrelas** - Avaliar lugares em 4 categorias: Ambiente, Romance, Custo-Benefício, Experiência
- **Comentários** - Adicionar comentários nos lugares
- **Status de Visitado** - Marcar lugares como visitados ou pendentes
- **Busca e Filtros** - Buscar lugares e filtrar por status
- **Organização por Categorias** - Lugares agrupados por tipo (Restaurante, Praia, Museu, etc.)
- **Imagens** - Upload e exibição de imagens dos lugares
- **Dashboard** - Visão geral com estatísticas e lugares recentes
- **i18n** - Interface em português (pt-BR)
- **Design Mobile-First** - Layout responsivo com navegação inferior

## Stack Tecnológica

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS 4, shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes
- **Banco de Dados**: MongoDB 8.0 com Mongoose 9
- **Autenticação**: NextAuth v4
- **i18n**: next-intl

## Pré-requisitos

- Node.js 18+
- Docker (para MongoDB)

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd duo-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente copiando `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

4. Inicie o MongoDB com Docker:
```bash
docker-compose up -d
```

5. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/           # Páginas de autenticação
│   ├── (protected)/      # Páginas protegidas (requer login)
│   │   ├── home/         # Dashboard
│   │   ├── places/       # CRUD de lugares
│   │   ├── partner/      # Conectar com Duo
│   │   └── profile/      # Perfil do usuário
│   └── api/              # API Routes
├── components/
│   ├── features/         # Componentes de feature
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes UI (shadcn)
├── models/               # Modelos Mongoose
├── types/                # Tipos TypeScript
└── lib/                  # Utilitários
```

## APIs

### Lugares
- `GET /api/places` - Listar lugares
- `POST /api/places` - Criar lugar
- `PUT /api/places` - Atualizar lugar
- `DELETE /api/places` - Excluir lugar

### Comentários
- `GET /api/comments?placeId=<id>` - Listar comentários
- `POST /api/comments` - Criar comentário
- `DELETE /api/comments` - Excluir comentário

### Stats
- `GET /api/stats` - Estatísticas do dashboard

## Deploy

O projeto pode ser deployado na Vercel ou qualquer plataforma que suporte Next.js.

```bash
npm run build
npm start
```
