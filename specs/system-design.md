# Spec System Design — duo

## 1. Visão Geral

O duo é uma aplicação **Next.js 16** com **App Router**, backend serverless via API Routes, banco **MongoDB** (Mongoose 9), e autenticação **NextAuth.js v4** com JWT.

### Princípios

1. **Serverless** — Zero infraestrutura gerenciada (Vercel/Railway)
2. **Couple-scoped** — Todo dado é filtrado por `coupleId`
3. **Clean Architecture** — APIs complexas seguem camadas (domain/infra/application)
4. **Type Safety** — TypeScript strict, zero `any`
5. **Mobile-first** — Design responsivo, performático em 4G

---

## 2. Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENTE                           │
│  Next.js 16 (React 19) • Tailwind CSS • shadcn/ui     │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                    SERVIDOR                             │
│  Next.js API Routes (Serverless Functions)              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth API   │  │  Business    │  │  External     │  │
│  │  NextAuth   │  │  API Routes  │  │  APIs         │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
┌─────────▼────────┐ ┌────▼─────┐  ┌─────────▼─────────┐
│    MongoDB       │ │ Cloudinary│  │  TMDB API         │
│    (Mongoose)    │ │ (Upload)  │  │  (Filmes/Séries)  │
└──────────────────┘ └──────────┘  └───────────────────┘
```

---

## 3. Stack

| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| Framework | Next.js | 16 | SSR/SSG, API Routes, App Router |
| React | React | 19 | Server Components, Suspense |
| Linguagem | TypeScript | 5 | Type safety |
| Banco | MongoDB | 8.0 | Flexibilidade, schema evolves |
| ODM | Mongoose | 9 | Validação, middleware, hooks |
| Auth | NextAuth.js | v4 | JWT, Credentials provider |
| Estilo | Tailwind CSS | v4 | Utility-first, theme via CSS |
| UI | shadcn/ui | base-nova | Acessibilidade, customização |
| i18n | next-intl | latest | Server-side translations |
| Upload | Cloudinary | v2 | CDN, transforms, free tier |
| Logger | Pino | latest | Structured logging |
| Testes | Jest + RTL | latest | Unit + integration |
| Ícones | lucide-react | latest | Consistência, tree-shakeable |

---

## 4. Estrutura de Pastas

```
duo-app/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Rotas públicas
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (protected)/               # Rotas autenticadas
│   │   │   ├── layout.tsx             # MobileNav wrapper
│   │   │   ├── home/page.tsx
│   │   │   ├── places/...
│   │   │   ├── movies/...
│   │   │   ├── partner/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   └── profile/...
│   │   ├── api/                       # API Routes
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── couple/
│   │   │   ├── places/
│   │   │   ├── movies/
│   │   │   ├── comments/
│   │   │   ├── categories/
│   │   │   ├── stats/
│   │   │   ├── upload/
│   │   │   └── docs/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── providers.tsx              # Session, i18n, tooltip
│   │   └── globals.css                # Theme completo
│   ├── components/
│   │   ├── ui/                        # Primitivas (26 componentes)
│   │   ├── layout/                    # PageContainer, Nav, Header
│   │   └── features/                  # PlaceCard, StatsCard, etc.
│   ├── hooks/                         # Hooks globais
│   ├── lib/                           # Utilitários (cn, tmdb, mongodb)
│   ├── models/                        # Schemas Mongoose
│   ├── types/                         # Types globais
│   └── i18n/                          # Config next-intl
├── i18n/
│   └── locales/pt.json               # Traduções
├── specs/                             # Documentação
├── public/                            # Assets estáticos
├── components.json                    # Config shadcn
├── jest.config.ts                     # Config testes
└── package.json
```

---

## 5. Modelos de Dados

### 5.1 User

```typescript
interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;           // select: false
  image?: string;
  bannerColor?: string;
  coupleId?: mongoose.Types.ObjectId;
  createdAt: Date;
}
```

**Índices:**
- `email`: unique

**Relação:** `coupleId` → `Couple._id`

---

### 5.2 Couple

```typescript
interface ICouple extends Document {
  _id: mongoose.Types.ObjectId;
  inviteCode: string;         // 6 chars, unique
  users: mongoose.Types.ObjectId[];
  createdAt: Date;
}
```

**Índices:**
- `inviteCode`: unique

**Regras:**
- Máximo 2 usuários por couple
- Todo dado (places, movies, etc.) é filtrado por `coupleId`

---

### 5.3 Place

```typescript
interface IPlace extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: string;           // enum: restaurante|praia|museu|parque|cafeteria|bar|loja
  address?: string;
  latitude?: number;          // -90 a 90
  longitude?: number;         // -180 a 180
  photoUrl?: string;
  visited: boolean;
  rating: {
    ambiente: number;         // 1-5
    romance: number;          // 1-5
    custo: number;            // 1-5
    experiencia: number;      // 1-5
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:**
- `coupleId` + `visited`
- `coupleId` + `category`

---

### 5.4 Movie

```typescript
interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  addedBy: mongoose.Types.ObjectId;
  tmdbId: number;
  mediaType: string;          // enum: movie|tv
  title: string;
  name?: string;              // TV shows
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  firstAirDate?: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  popularity: number;
  tagline?: string;
  runtime?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  status?: string;
  coupleRating: {
    romance: number;          // 1-5
    diversao: number;         // 1-5
    emocao: number;           // 1-5
    recomendaria: number;     // 1-5
  };
  favoritedBy: mongoose.Types.ObjectId[];
  watchStatuses: [{
    userId: mongoose.Types.ObjectId;
    status: string;           // not_watched|watching|watched|to_watch
  }];
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:**
- `coupleId` + `tmdbId`: unique
- `coupleId` + `mediaType`
- `coupleId` + `createdAt` (desc)

---

### 5.5 Comment

```typescript
interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  text: string;               // maxlength: 500
  createdAt: Date;
}
```

**Índices:**
- `placeId` + `createdAt` (desc)

---

### 5.6 Category

```typescript
interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:**
- `coupleId` + `order`

---

## 6. Arquitetura de APIs

### 6.1 Padrão — Clean Architecture

APIs complexas (User) usam:

```
api/<resource>/
├── route.ts                    # Entry point
├── application/
│   ├── controllers/
│   │   └── <resource>.controller.ts
│   └── use-cases/
│       └── <resource>.service.ts
├── domain/
│   ├── dto/
│   │   ├── <resource>-request.dto.ts
│   │   └── <resource>-response.dto.ts
│   ├── types/
│   │   └── <resource>.types.ts
│   └── strategies/
│       ├── validation.strategy.ts
│       └── <resource>-strategies.ts
└── infra/
    ├── mappers/
    │   └── <resource>.mapper.ts
    └── repositories/
        └── <resource>.repository.ts
```

**Fluxo:**
```
route.ts → controller.ts → service.ts → repository.ts → Mongoose
                            ↘ mapper.ts
                            ↘ strategies/
```

### 6.2 Padrão — Simples

APIs menores (Places, Movies, etc.) usam direto:

```
api/<resource>/route.ts    # Lógica toda no route
```

### 6.3 Response Shape

```typescript
// Sucesso
{ data: T }

// Erro
{ error: string }

// Paginado
{ data: T[], total: number, page: number }
```

---

## 7. API Routes

### Auth

| Rota | Método | Descrição |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Registro |

### User (Clean Architecture)

| Rota | Método | Descrição |
|---|---|---|
| `/api/user` | GET | Buscar perfil |
| `/api/user` | PUT | Atualizar perfil |
| `/api/user` | PATCH | Trocar senha |

### Couple

| Rota | Método | Descrição |
|---|---|---|
| `/api/couple` | GET | Buscar info do casal |
| `/api/couple` | PUT | Gerar código de convite |
| `/api/couple` | POST | Aceitar código |

### Places

| Rota | Método | Descrição |
|---|---|---|
| `/api/places` | GET | Listar lugares (filtros: category, visited, search, limit) |
| `/api/places` | POST | Criar lugar |
| `/api/places` | PUT | Atualizar lugar |
| `/api/places` | DELETE | Excluir lugar |

### Movies

| Rota | Método | Descrição |
|---|---|---|
| `/api/movies` | GET | Listar filmes (filtros: type, favorite) |
| `/api/movies` | POST | Adicionar filme |
| `/api/movies` | PUT | Atualizar (favorito, rating, status) |
| `/api/movies` | DELETE | Excluir filme |
| `/api/movies/[id]` | GET | Detalhes do TMDB |

### TMDB

| Rota | Método | Descrição |
|---|---|---|
| `/api/tmdb/search` | GET | Buscar filmes/séries |

### Categories

| Rota | Método | Descrição |
|---|---|---|
| `/api/categories` | GET | Listar categorias |
| `/api/categories` | POST | Criar categoria |
| `/api/categories` | PUT | Atualizar categoria |
| `/api/categories` | DELETE | Excluir categoria |

### Comments

| Rota | Método | Descrição |
|---|---|---|
| `/api/comments` | GET | Listar comentários (placeId) |
| `/api/comments` | POST | Criar comentário |
| `/api/comments` | DELETE | Excluir comentário |

### Stats

| Rota | Método | Descrição |
|---|---|---|
| `/api/stats` | GET | Estatísticas do dashboard |

### Upload

| Rota | Método | Descrição |
|---|---|---|
| `/api/upload` | POST | Upload para Cloudinary |

---

## 8. Autenticação

### Provider

- **Credentials** (email + senha)
- **JWT** strategy (não session database)

### Fluxo

```
1. Usuário submete email + senha
2. NextAuth verifica no MongoDB (bcrypt compare)
3. Token JWT é gerado com { id, email, name }
4. Token é salvo em cookie (httpOnly, secure)
5. Todas as rotas /api/* verificam o token
```

### Hooks

```typescript
// Client-side
const { data: session, status } = useSession();
// session.user.id, session.user.name, session.user.email

// Server-side
const session = await getServerSession(authOptions);
```

### Extensão do Session

```typescript
// types/index.ts
interface ExtendedSessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  bannerColor?: string | null;
  coupleId?: string | null;
}
```

---

## 9. Banco de Dados

### MongoDB

| Propriedade | Valor |
|---|---|
| Versão | 8.0 |
| Driver | Mongoose 9 |
| Conexão | Cached singleton pattern |
| URI | `MONGODB_URI` env var |

### Conexão

```typescript
// lib/mongodb.ts
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### Tenant Model

Todo dado é **couple-scoped**:

```typescript
// Padrão de query
const places = await Place.find({ coupleId: session.user.coupleId });
```

### Índices Compostos

| Collection | Índice | Uso |
|---|---|---|
| places | `coupleId + visited` | Filtro por visitado |
| places | `coupleId + category` | Filtro por categoria |
| movies | `coupleId + tmdbId` | Prevenir duplicatas |
| movies | `coupleId + mediaType` | Filtro por tipo |
| movies | `coupleId + createdAt` | Ordenação |
| comments | `placeId + createdAt` | Ordenação cronológica |
| categories | `coupleId + order` | Ordenação |

---

## 10. Integrações Externas

### 10.1 TMDB (The Movie Database)

| Propriedade | Valor |
|---|---|
| API Key | `TMDB_API_KEY` env var |
| Base URL | `https://api.themoviedb.org/3` |
| Idioma | `pt-BR` |
| Cache | `next: { revalidate: 3600 }` (1 hora) |

**Endpoints usados:**
- `GET /search/multi` — Busca
- `GET /movie/popular` — Filmes populares
- `GET /tv/popular` — Séries populares
- `GET /movie/{id}` — Detalhes filme
- `GET /tv/{id}` — Detalhes série
- `GET /movie/{id}/credits` — Elenco filme
- `GET /tv/{id}/credits` — Elenco série
- `GET /trending/all/{timeWindow}` — Trending

**Imagens:**
- Base: `https://image.tmdb.org/t/p`
- Sizes: `w200`, `w300`, `w500`, `original`

### 10.2 Cloudinary

| Propriedade | Valor |
|---|---|
| Cloud Name | `CLOUDINARY_CLOUD_NAME` |
| API Key | `CLOUDINARY_API_KEY` |
| API Secret | `CLOUDINARY_API_SECRET` |
| Folder | `duo/avatars` |
| Transform | 256x256 crop |

**Endpoint:** `POST /api/upload`

**Padrão:**
```typescript
const formData = new FormData();
formData.append("file", file);
const res = await fetch("/api/upload", { method: "POST", body: formData });
const { url } = await res.json();
```

---

## 11. i18n

### Configuração

| Propriedade | Valor |
|---|---|
| Locale | `pt` |
| Timezone | `America/Sao_Paulo` |
| Provider | `next-intl` |

### Namespaces

| Namespace | Uso |
|---|---|
| `common` | Textos compartilhados |
| `nav` | Navegação |
| `auth.login` | Login |
| `auth.register` | Registro |
| `dashboard` | Home |
| `places` | Lista de lugares |
| `placeDetail` | Detalhe do lugar |
| `placeForm` | Formulário de lugar |
| `newPlace` | Novo lugar |
| `editPlace` | Editar lugar |
| `profile` | Perfil |
| `categories` | Categorias |
| `duo` | Vinculação |

### Uso

```typescript
const t = useTranslations("profile");
t("title")
t("nameRequired")
t("greeting", { name: userName })
```

---

## 12. Logging

### Stack

| Ferramenta | Uso |
|---|---|
| Pino | Logger principal |
| pino-pretty | Formatação em dev |

### Padrão

```typescript
import { logger } from "@/lib/logger";

logger.info({ userId, action: "place_created" }, "Place created");
logger.error({ error, userId }, "Failed to update place");
```

---

## 13. Testes

### Stack

| Ferramenta | Uso |
|---|---|
| Jest | Test runner |
| React Testing Library | Component tests |
| jest-dom | DOM assertions |

### Estrutura

```
src/tests/
├── setup/jest.setup.ts
├── app/
│   ├── (auth)/
│   ├── (protected)/
│   └── api/
└── lib/
```

### Convenções

- Arquivos: `*.test.ts` ou `*.test.tsx`
- Espelham estrutura de `src/`
- Padrão AAA (Arrange, Act, Assert)
- Mocks: `jest.mock()` para Next.js, Mongoose, serviços

### Coverage Mínimo

| Camada | Cobertura |
|---|---|
| Hooks | 100% |
| Strategies/Validation | 100% |
| Mappers | 100% |
| Controllers | 100% |
| Services | 100% |
| Components | Fluxos principais |

---

## 14. Deploy

### Plataforma

| Opção | Recomendada |
|---|---|
| Vercel | ✅ Padrão Next.js |
| Railway | ✅ Alternativa (MongoDB grátis) |
| Docker | ✅ Auto-hospedado |

### Variáveis de Ambiente

```env
# MongoDB
MONGODB_URI=mongodb://duo:duo123@localhost:27018/duo

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# TMDB
TMDB_API_KEY=...

# Firebase (push notifications)
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

### Docker (dev)

```yaml
services:
  mongo:
    image: mongo:8.0
    ports:
      - "27018:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: duo
      MONGO_INITDB_ROOT_PASSWORD: duo123
```

---

## 15. Performance

### Otimizações

| Técnica | Onde |
|---|---|
| Server Components | Layouts, pages estáticas |
| Dynamic imports | Modals, heavy components |
| Image optimization | Next.js `<Image>` |
| ISR | Dados do TMDB (1h cache) |
| Database indexes | Queries frequentes |
| Skeleton loading | UX de carregamento |

### Métricas

| Métrica | Meta |
|---|---|
| FCP | < 1.5s |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TTI | < 3s |

---

## 16. Segurança

### Regras

| Regra | Implementação |
|---|---|
| Password hashing | bcrypt cost 12 |
| JWT | httpOnly, secure cookies |
| CORS | Configurado em next.config |
| Rate limiting | Implementar (pós-MVP) |
| Input validation | Strategy pattern + Zod |
| SQL/NoSQL injection | Mongoose sanitization |
| XSS | React escaping + CSP |
| Secrets | Nunca no código, sempre env vars |

### Couple Isolation

```typescript
// Toda query filtra por coupleId
const places = await Place.find({ coupleId: session.user.coupleId });

// Nunca confiar no client-side coupleId
// Sempre obter do session/token
```

---

## 17. Monitoramento

### Ferramentas

| Ferramenta | Uso |
|---|---|
| Pino | Logs estruturados |
| Sentry (pós-MVP) | Error tracking |
| Vercel Analytics | Web Vitals |
| PostHog (pós-MVP) | Product analytics |

### Logs

```typescript
// Request logging
logger.info({ method, url, userId, duration }, "Request completed")

// Error logging
logger.error({ error, stack, userId }, "Unhandled error")

// Business logging
logger.info({ coupleId, placeId }, "Place created")
```
