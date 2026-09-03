# Arquitetura - duo-app

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| React | 19 |
| Linguagem | TypeScript 5 |
| Banco | MongoDB + Mongoose 9 |
| Auth | NextAuth.js v4 (Credentials + JWT) |
| Estilo | Tailwind CSS 4 + tailwind-merge |
| UI Primitives | Radix UI + @base-ui/react + CVA |
| i18n | next-intl (pt-BR) |
| Upload | Cloudinary |
| Logger | Pino |
| Testes | Jest + React Testing Library |
| APIs Externas | TMDB (The Movie Database) |

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── (auth)/                         # Pages públicas
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/                    # Pages autenticadas
│   │   ├── layout.tsx                  # Layout compartilhado (MobileNav)
│   │   ├── home/page.tsx
│   │   ├── places/...
│   │   ├── partner/page.tsx
│   │   ├── categories/page.tsx
│   │   └── profile/                    # ← Padrão MVVM
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       ├── types/
│   │       ├── hooks/
│   │       ├── views/
│   │       ├── components/
│   │       ├── data/
│   │       └── utils/
│   ├── api/
│   │   ├── auth/
│   │   ├── user/                       # ← Padrão Clean Architecture
│   │   │   ├── route.ts
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   └── infra/
│   │   ├── places/route.ts
│   │   ├── upload/route.ts
│   │   └── ...
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # Design system (primitivas)
│   ├── layout/                         # Layout components
│   └── features/                       # Componentes de domínio
├── hooks/                              # Hooks globais
├── lib/                                # Utilitários compartilhados
├── models/                             # Models Mongoose
├── types/                              # Types globais
├── i18n/                               # Configuração i18n
└── tests/                              # Testes (espelha src/)
```

---

## Convenções de Nomenclatura

### Arquivos

| Localização | Padrão | Exemplo |
|---|---|---|
| `components/ui/` | Arquivo flat, sem sufixo | `button.tsx`, `card.tsx` |
| `components/layout/` | `*.component.tsx` | `page-header.component.tsx` |
| `components/features/` | `index.tsx` barrel | `place-card/index.tsx` |
| Feature views | `*.view.tsx` | `profile-view.view.tsx` |
| Feature components | `*.component.tsx` | `profile-card.component.tsx` |
| Feature hooks | `*.hook.ts` / `*.hook.tsx` | `use-profile.hook.ts` |
| Feature data | `*.data.ts` | `banner-presets.data.ts` |
| Feature utils | `*.utils.ts` | `color-utils.utils.ts` |
| Feature types | `*.types.ts` | `profile.types.ts` |
| API DTOs | `*.dto.ts` | `user-request.dto.ts` |
| API strategies | `*.strategy.ts` | `validation.strategy.ts` |
| API controllers | `*.controller.ts` | `user.controller.ts` |
| API services | `*.service.ts` | `user.service.ts` |
| API repositories | `*.repository.ts` | `user.repository.ts` |
| API mappers | `*.mapper.ts` | `user.mapper.ts` |
| Models | Arquivo flat | `user.ts`, `place.ts` |
| Lib | Arquivo flat | `auth.ts`, `utils.ts` |

### Diretórios

- **kebab-case** para tudo: `profile-card/`, `use-profile/`, `banner-presets/`
- **Route groups** com parênteses: `(auth)/`, `(protected)/`

### Exports

| Local | Padrão |
|---|---|
| `components/ui/` | Named exports |
| `components/layout/` | Named exports |
| `components/features/` | Named exports |
| `app/` pages | Default export |
| `models/` | Default export |
| `lib/` | Named exports |
| `types/` | Named exports |

---

## Padrão de Página — MVVM

Toda page complexa segue o padrão **Model-View-ViewModel**:

```
<page>/
├── page.tsx              # Controller — entry point, view switcher
├── loading.tsx           # Next.js loading state
├── types/
│   └── <page>.types.ts   # Types específicos da page
├── hooks/
│   └── use-<feature>/
│       └── use-<feature>.hook.ts    # ViewModel — lógica de negócio
├── views/
│   └── <view-name>/
│       └── <view-name>.view.tsx     # View — tela específica
├── components/
│   └── <component-name>/
│       └── <component-name>.component.tsx  # Componentes reutilizáveis
├── data/
│   └── <data-name>/
│       └── <data-name>.data.ts      # Constantes/dados estáticos
└── utils/
    └── <util-name>/
        └── <util-name>.utils.ts     # Funções utilitárias locais
```

### Controller (page.tsx)

O controller é o entry point. Ele usa um hook orquestrador para decidir qual view renderizar.

```tsx
"use client";

import { useProfilePage } from "./hooks/use-profile-page/use-profile-page.hook";
import { ProfileLoadingView } from "./views/profile-loading/profile-loading.view";
import { ProfileEditView } from "./views/profile-edit/profile-edit.view";
import { ProfileView } from "./views/profile-view/profile-view.view";

export default function ProfilePage() {
  const { view, props } = useProfilePage();

  switch (view) {
    case "loading":  return <ProfileLoadingView />;
    case "edit":     return <ProfileEditView {...props} />;
    case "password": return <ProfilePasswordView {...props} />;
    case "view":     return <ProfileView {...props} />;
  }
}
```

### ViewModel (hook)

O hook gere o estado e expõe ações para a view.

```tsx
// use-profile.hook.ts
export function useProfile() {
  const [mode, setMode] = useState<Mode>("view");
  const [bannerColor, setBannerColor] = useState<string | null>(null);

  const handleBack = useCallback(() => setMode("view"), []);

  return { mode, setMode, bannerColor, handleBack };
}
```

### View

A view é uma tela específica. Ela recebe props do hook e renderiza a UI.

```tsx
// profile-edit.view.tsx
"use client";

interface ProfileEditViewProps {
  onBack: () => void;
  onSaved: () => void;
}

export function ProfileEditView({ onBack, onSaved }: ProfileEditViewProps) {
  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      <ProfileForm onCancel={onBack} onSaved={onSaved} />
    </PageContainer>
  );
}
```

---

## Padrão de API — Clean Architecture

Toda rota API complexa segue a arquitetura limpa:

```
api/<resource>/
├── route.ts                              # Entry point (GET/POST/PUT/DELETE)
├── application/
│   ├── controllers/
│   │   └── <resource>.controller.ts      # Auth, validação, error handling
│   └── use-cases/
│       └── <resource>.service.ts         # Lógica de negócio
├── domain/
│   ├── dto/
│   │   ├── <resource>-request.dto.ts     # Request shapes
│   │   └── <resource>-response.dto.ts    # Response shapes
│   ├── types/
│   │   └── <resource>.types.ts           # Types do domínio
│   └── strategies/
│       ├── validation.strategy.ts        # Interface de validação
│       └── <resource>-strategies.ts      # Implementações
└── infra/
    ├── mappers/
    │   └── <resource>.mapper.ts          # Model → Domain
    └── repositories/
        └── <resource>.repository.ts      # Queries Mongoose
```

### Fluxo

```
route.ts → controller.ts → service.ts → repository.ts → Mongoose Model
                            ↘ mapper.ts
                            ↘ strategies/
```

### Route (Entry Point)

```tsx
// api/user/route.ts
export async function GET(request: NextRequest) {
  const result = await getProfile();
  return NextResponse.json(result.body, { status: result.status });
}
```

### Controller

O controller é responsável por:
1. Verificar autenticação
2. Validar input via Strategy
3. Chamar o service
4. Retornar `{ status, body }`

```tsx
// user.controller.ts
export async function updateProfileController(body: unknown) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { status: 401 as const, body: { error: "Não autorizado" } };
  }

  const validation = validateWithStrategy(updateProfileStrategy, body);
  if (!validation.success) {
    return { status: 400 as const, body: { error: validation.error } };
  }

  const user = await updateProfile(userId, validation.data!);
  return { status: 200 as const, body: { data: user } };
}
```

### Service (Use Case)

O service contém a lógica de negócio pura.

```tsx
// user.service.ts
export async function updateProfile(userId: string, data: UpdateProfileData): Promise<UserData> {
  const user = await findUserById(userId);
  if (!user) throw new Error("Usuário não encontrado");

  if (data.email !== user.email) {
    const existing = await findUserByEmail(data.email, userId);
    if (existing) throw new Error("Este email já está em uso");
  }

  user.name = data.name;
  user.email = data.email;
  await saveUser(user);

  return toUserData(user);
}
```

### Strategy (Validação)

Pattern para validação de input. Cada endpoint tem sua strategy.

```tsx
// validation.strategy.ts
export type ValidationStrategy<T> = {
  validate: (data: unknown) => ValidationResult<T>;
};

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// user-strategies.ts
export class UpdateProfileStrategy implements ValidationStrategy<UpdateProfileDto> {
  validate(data: unknown): ValidationResult<UpdateProfileDto> {
    // Validação dos campos
    return { success: true, data: { ... } };
  }
}

export function validateWithStrategy<T>(
  strategy: ValidationStrategy<T>,
  data: unknown
): ValidationResult<T> {
  return strategy.validate(data);
}
```

### Repository

O repository encapsula as queries ao banco.

```tsx
// user.repository.ts
export async function findUserById(userId: string): Promise<IUser | null> {
  await connectToDatabase();
  return User.findById(userId).select(USER_FIELDS);
}

export async function saveUser(user: IUser): Promise<void> {
  await user.save();
}
```

### Mapper

O mapper converte entre models do banco e types do domínio.

```tsx
// user.mapper.ts
export function toUserData(user: IUser): UserData {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || null,
    bannerColor: user.bannerColor || null,
    createdAt: user.createdAt,
  };
}
```

### Response Shape

```typescript
{ data?: T; error?: string }
```

---

## UI Primitives (`components/ui/`)

```tsx
import { cn } from "@/lib/utils";

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn("base-styles", className)} {...props} />
  );
}

export { Button };
```

**Skeleton Primitives:**
- `Skeleton` — bloco genérico
- `SkeletonCircle` — círculo (avatar)
- `SkeletonSquare` — quadrado (ícone)
- `SkeletonLine` — linha de texto
- `SkeletonCard` — card container

---

## Layout Components (`components/layout/`)

```tsx
// PageContainer — wrapper centralizado
<PageContainer>{children}</PageContainer>

// PageHeader — título + ação
<PageHeader title="Perfil" action={<Button>Editar</Button>} />
```

---

## Models Mongoose

```typescript
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string; // select: false
  image?: string;
  bannerColor?: string;
  coupleId?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({ /* ... */ });

UserSchema.index({ coupleId: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
```

**Regras:**
- `password` sempre com `select: false`
- `coupleId` como tenant/scoping key
- Índices compostos para queries frequentes

---

## i18n

```tsx
const t = useTranslations("auth.login");
t("title")
t("greeting", { name: userName })
t("placesToExplore", { count: n })  // ICU plural
```

---

## Hooks

### Hook de Feature

```tsx
// use-profile.hook.ts
export function useProfile() {
  const [mode, setMode] = useState<Mode>("view");
  // Lógica de negócio
  return { mode, setMode, handleBack };
}
```

### Hook Orquestrador (View Switcher)

```tsx
// use-profile-page.hook.tsx
export function useProfilePage() {
  const { mode, ... } = useProfile();
  return { view: mode, props: { ... } };
}
```

---

## Padrão de um Feature Module Completo

```
profile/
├── page.tsx                          # Controller
├── loading.tsx                       # Next.js loading
├── types/
│   └── profile.types.ts
├── hooks/
│   ├── use-profile-page/
│   │   └── use-profile-page.hook.tsx
│   ├── use-profile/
│   │   └── use-profile.hook.ts
│   ├── use-profile-form/
│   │   └── use-profile-form.hook.ts
│   └── use-avatar-upload/
│       └── use-avatar-upload.hook.ts
├── views/
│   ├── profile-view/
│   │   └── profile-view.view.tsx
│   ├── profile-edit/
│   │   └── profile-edit.view.tsx
│   ├── profile-password/
│   │   └── profile-password.view.tsx
│   └── profile-loading/
│       └── profile-loading.view.tsx
├── components/
│   ├── profile-card/
│   │   └── profile-card.component.tsx
│   ├── profile-form/
│   │   └── profile-form.component.tsx
│   ├── profile-menu-item/
│   │   └── profile-menu-item.component.tsx
│   └── skeleton/
│       └── skeleton.component.tsx
├── data/
│   └── banner-presets/
│       └── banner-presets.data.ts
└── utils/
    └── color-utils/
        └── color-utils.utils.ts
```

---

## Padrão de uma API Completa

```
user/
├── route.ts
├── application/
│   ├── controllers/
│   │   └── user.controller.ts
│   └── use-cases/
│       └── user.service.ts
├── domain/
│   ├── dto/
│   │   ├── user-request.dto.ts
│   │   └── user-response.dto.ts
│   ├── types/
│   │   └── user.types.ts
│   └── strategies/
│       ├── validation.strategy.ts
│       └── user-strategies.ts
└── infra/
    ├── mappers/
    │   └── user.mapper.ts
    └── repositories/
        └── user.repository.ts
```

---

## APIs Externas

### TMDB (The Movie Database)

**Uso:** Buscar informações de filmes/séries para enriquecer os places (ex: cinemas, restaurantes temáticos).

**Configuração:**
```env
TMDB_API_KEY=b805c545ceadfee8f93e2bc45573d1b5
```

**Padrão de integração:**

```typescript
// lib/tmdb.ts
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY!);
  url.searchParams.set("language", "pt-BR");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}
```

**Uso em Components/Hooks:**

```typescript
// Hook
const [movies, setMovies] = useState<Movie[]>([]);

useEffect(() => {
  async function search() {
    const data = await tmdbFetch<TMDBSearchResponse>("/search/movie", { query: "cinema" });
    setMovies(data.results);
  }
  search();
}, []);
```

**Endpoints principais:**
- `GET /search/movie` — Buscar filmes
- `GET /search/person` — Buscar pessoas
- `GET /movie/{id}` — Detalhes do filme
- `GET /movie/{id}/credits` — Elenco
- `GET /movie/{id}/images` — Imagens/posters

**Rate Limits:**
- 40 requests por 10 segundos
- Retry automático com exponential backoff

### Cloudinary

**Uso:** Upload e servir imagens de perfil.

**Configuração:**
```env
CLOUDINARY_CLOUD_NAME=dqfskeyhk
CLOUDINARY_API_KEY=745918487472362
CLOUDINARY_API_SECRET=QVPfRt8HXjPt3Ggn49RFtWHkO94
```

**Endpoint:** `POST /api/upload`

**Padrão:**
```typescript
// Upload via FormData
const formData = new FormData();
formData.append("file", file);
const res = await fetch("/api/upload", { method: "POST", body: formData });
const { url } = await res.json();
```
