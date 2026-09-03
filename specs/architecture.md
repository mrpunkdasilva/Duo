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

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── (auth)/                    # Pages públicas
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/               # Pages autenticadas
│   │   ├── layout.tsx             # Layout compartilhado (MobileNav)
│   │   ├── home/page.tsx
│   │   ├── places/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── partner/page.tsx
│   │   ├── categories/page.tsx
│   │   └── profile/               # Feature complexa (MVVM)
│   │       ├── page.tsx           # Controller/entry point
│   │       ├── loading.tsx
│   │       ├── types/
│   │       ├── hooks/
│   │       ├── views/
│   │       ├── components/
│   │       ├── data/
│   │       └── utils/
│   ├── api/                       # Rotas API
│   │   ├── auth/
│   │   ├── user/                  # Clean Architecture
│   │   ├── places/
│   │   ├── categories/
│   │   ├── couple/
│   │   ├── stats/
│   │   └── upload/
│   ├── layout.tsx                 # Root layout
│   ├── providers.tsx              # Client providers
│   └── globals.css
├── components/
│   ├── ui/                        # Design system (primitivas)
│   ├── layout/                    # Layout components
│   └── features/                  # Componentes de domínio
├── hooks/                         # Hooks globais
├── lib/                           # Utilitários compartilhados
├── models/                        # Models Mongoose
├── types/                         # Types globais
├── i18n/                          # Configuração i18n
└── tests/                         # Testes (espelha src/)
```

---

## Convenções de Nomenclatura

### Arquivos

| Localização | Padrão | Exemplo |
|---|---|---|
| `components/ui/` | Arquivo flat, sem sufixo | `button.tsx`, `card.tsx` |
| `components/layout/` | Arquivo flat ou `index.tsx` | `page-header/page-header.component.tsx` |
| `components/features/` | `index.tsx` barrel | `place-card/index.tsx` |
| Feature views | `*.view.tsx` | `profile-view.view.tsx` |
| Feature components | `*.component.tsx` | `profile-card.component.tsx` |
| Feature hooks | `*.hook.ts` / `*.hook.tsx` | `use-profile.hook.ts` |
| Feature data | `*.data.ts` | `banner-presets.data.ts` |
| Feature utils | `*.utils.ts` | `color-utils.utils.ts` |
| Feature types | `*.types.ts` | `profile.types.ts` |
| API DTOs | `*.dto.ts` | `user-request.dto.ts` |
| API strategies | `*.strategy.ts` | `validation.strategy.ts` |
| Models | Arquivo flat | `user.ts`, `place.ts` |
| Lib | Arquivo flat | `auth.ts`, `utils.ts` |
| Rotas API | `route.ts` (Next.js) | `api/places/route.ts` |

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

## Padrões de Páginas

### Página Simples

```tsx
"use client";

export default function SimplePage() {
  const t = useTranslations("namespace");
  // useState + useEffect para dados
  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      {/* conteúdo */}
    </PageContainer>
  );
}
```

### Página Complexa (MVVM)

```
page.tsx          → Controller (view switcher)
hooks/            → Lógica de negócio
views/            → Telas (loading, view, edit, password)
components/       → Componentes reutilizáveis da page
types/            → Types específicos da page
data/             → Constantes/dados estáticos
utils/            → Funções utilitárias locais
```

**Controller pattern:**

```tsx
// page.tsx
export default function Page() {
  const { view, props } = usePageHook();

  switch (view) {
    case "loading": return <LoadingView {...props} />;
    case "edit":    return <EditView {...props} />;
    case "view":    return <ViewView {...props} />;
  }
}
```

---

## Padrões de Componentes

### UI Primitives (`components/ui/`)

```tsx
// button.tsx
import { cn } from "@/lib/utils";

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn("base-styles", className)}
      {...props}
    />
  );
}

export { Button };
```

### Layout Components (`components/layout/`)

```tsx
// page-header/page-header.component.tsx
interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  action?: React.ReactNode;
}

function PageHeader({ title, action, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <Heading as="h1" variant="page">{title}</Heading>
      {action}
    </div>
  );
}

export { PageHeader };
```

### Feature Components (`components/features/`)

```tsx
// place-card/index.tsx
interface PlaceCardProps {
  place: Place;
  onToggleVisited: (id: string) => void;
}

export function PlaceCard({ place, onToggleVisited }: PlaceCardProps) {
  // ...
}
```

---

## Padrões de Hooks

### Hook de Feature

```tsx
// use-profile.hook.ts
export function useProfile() {
  const [mode, setMode] = useState<Mode>("view");
  const [bannerColor, setBannerColor] = useState<string | null>(null);

  // Lógica de negócio

  return {
    mode,
    setMode,
    bannerColor,
    handleBack,
  };
}
```

### Hook Orquestrador (View Switcher)

```tsx
// use-profile-page.hook.tsx
export function useProfilePage() {
  const { mode, ... } = useProfile();

  // Retorna qual view mostrar e suas props
  return { view: mode, props: { ... } };
}
```

---

## Padrões de API

### Rota Simples

```tsx
// api/places/route.ts
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  // Lógica de negócio

  return NextResponse.json({ success: true, data: result });
}
```

### Rota Clean Architecture

```
route.ts → controller.ts → service.ts → repository.ts → Model
                            \-> mapper.ts
                            \-> strategies/
```

### Response Shape

```typescript
{ success: boolean; data?: T; error?: string }
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

const UserSchema = new Schema<IUser>({
  // ...
});

// Índices compostos
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
// Uso
const t = useTranslations("auth.login");
t("title")
t("greeting", { name: userName })
t("placesToExplore", { count: n })  // ICU plural

// Estrutura do JSON
{
  "auth": {
    "login": {
      "title": "Entrar",
      "greeting": "Olá, {name}"
    }
  }
}
```

---

## Skeleton Primitives

```tsx
import { Skeleton, SkeletonCircle, SkeletonLine, SkeletonCard, SkeletonSquare } from "@/components/ui/skeleton";

// Uso
<SkeletonCard>
  <Skeleton className="h-24 rounded-none" />
  <SkeletonCircle className="h-24 w-24" />
  <SkeletonLine className="h-5 w-32" />
</SkeletonCard>
```

**Primitivas disponíveis:**
- `Skeleton` — bloco genérico
- `SkeletonCircle` — círculo (avatar)
- `SkeletonSquare` — quadrado (ícone)
- `SkeletonLine` — linha de texto
- `SkeletonCard` — card container

---

## Layout Components

```tsx
// PageContainer — wrapper centralizado
<PageContainer>
  {children}
</PageContainer>

// PageHeader — título + ação
<PageHeader
  title="Perfil"
  action={<Button>Editar</Button>}
/>
```

---

## Estrutura de um Feature Module (Profile)

```
profile/
├── page.tsx                    # Controller
├── loading.tsx                 # Next.js loading
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
