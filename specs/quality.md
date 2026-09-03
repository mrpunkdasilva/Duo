# Spec — Qualidade, Testes, Acessibilidade e Documentação

## 1. Zero `any` no Código Production

### Regra

Todo `any` no código production deve ser eliminado. O TypeScript existe para garantir type safety.

### Onde estão os `any` atuais

| Arquivo | Linha | Problema | Solução |
|---|---|---|---|
| `lib/auth.ts` | 45, 54, 55 | `(session.user as any).id` | Criar interface `ExtendedSession` |
| `api/stats/route.ts` | 47 | `item: any` no forEach | Tipar com o type do aggregation |
| `(protected)/places/[id]/page.tsx` | 382 | `(session?.user as any)?.id` | Usar `ExtendedSession` |

### Padrão: ExtendedSession

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

interface ExtendedSession {
  user: ExtendedSessionUser;
}
```

### Uso no auth.ts

```typescript
// Antes
(session.user as any).id = token.id as string;

// Depois
const user = session.user as ExtendedSessionUser;
user.id = token.id as string;
```

### Regras

- Nunca usar `any` — usar `unknown` + type guard se necessário
- Nunca usar `as any` — criar interface ou usar type assertion adequada
- `as unknown as Tipo` só como último recurso, com comentário explicativo
- Exceção: `jest.Mock` casts em testes são aceitáveis

---

## 2. Guia de Testes

### Stack

| Ferramenta | Versão |
|---|---|
| Jest | Configurado em `jest.config.ts` |
| React Testing Library | `@testing-library/react` |
| jest-dom | `@testing-library/jest-dom` |

### Estrutura de Pastas

```
src/tests/
├── setup/
│   └── jest.setup.ts
├── app/
│   ├── (auth)/
│   │   ├── login.test.tsx
│   │   └── register.test.tsx
│   ├── (protected)/
│   │   ├── home.test.tsx
│   │   ├── places.test.tsx
│   │   └── profile/
│   │       ├── hooks/
│   │       │   ├── use-profile.test.ts
│   │       │   ├── use-profile-form.test.ts
│   │       │   └── use-password-form.test.ts
│   │       └── utils/
│   │           ├── color-utils.test.ts
│   │           └── file-utils.test.ts
│   └── api/
│       ├── places.test.ts
│       ├── stats.test.ts
│       └── user/
│           ├── route.test.ts
│           ├── application/
│           │   ├── user.controller.test.ts
│           │   └── user.service.test.ts
│           ├── domain/
│           │   ├── user.mapper.test.ts
│           │   └── user-strategies.test.ts
│           └── infra/
│               └── user.repository.test.ts
└── lib/
    ├── utils.test.ts
    ├── helpers.test.ts
    └── openapi.test.ts
```

### Convenções

#### Naming

- Arquivos: `<nome>.test.ts` ou `<nome>.test.tsx`
- Espelham a estrutura de `src/`
- `describe()` com nome do módulo/função
- `it()` com descrição em inglês, começando com "should"

#### Estrutura Básica

```typescript
// 1. Mocks no topo do arquivo (ANTES dos imports)
const mockFetch = jest.fn();
global.fetch = mockFetch;

// 2. Imports dos módulos mockados
import { renderHook, act } from "@testing-library/react";
import { useMyHook } from "@/app/...";

// 3. describe + beforeEach + testes
describe("useMyHook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  });

  it("should initialize correctly", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe("expected");
  });
});
```

#### Mocking

```typescript
// Módulos Next.js
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(() => ({ data: null, update: jest.fn() })),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Models Mongoose
const mockFindOne = jest.fn();
jest.mock("@/models/user", () => ({
  __esModule: true,
  default: { findOne: (...args: unknown[]) => mockFindOne(...args) },
}));

// Serviços
jest.mock("@/app/api/user/application/use-cases/user.service", () => ({
  getUser: jest.fn(),
  updateProfile: jest.fn(),
}));
```

### Tipos de Teste

#### 1. Component Tests

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

it("should render form elements", () => {
  render(<MyPage />);
  expect(screen.getByRole("button", { name: /submit/i })).toBeTruthy();
  expect(screen.getByLabelText("Email")).toBeTruthy();
});

it("should show error on invalid input", async () => {
  render(<MyPage />);
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid" } });
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText("Email inválido")).toBeTruthy();
  });
});
```

**Obrigatório testar:**
- Renderização dos elementos (labels, buttons, inputs)
- Interação do usuário (change, click, submit)
- Estados de erro
- Estados de loading
- Acessibilidade (getByRole, getByLabelText)

#### 2. Hook Tests

```typescript
import { renderHook, act } from "@testing-library/react";

it("should update state", () => {
  const { result } = renderHook(() => useMyHook());
  act(() => result.current.setValue("new"));
  expect(result.current.value).toBe("new");
});

it("should call API on mount", async () => {
  const { result } = renderHook(() => useMyHook());
  await act(async () => {});
  expect(mockFetch).toHaveBeenCalled();
});
```

#### 3. API Route Tests

```typescript
import { GET, PUT } from "@/app/api/my-route/route";

it("should return 401 when no session", async () => {
  (getServerSession as jest.Mock).mockResolvedValue(null);
  const request = new Request("http://localhost/api/my-route");
  const response = await GET(request);
  expect(response.status).toBe(401);
});

it("should return 200 with data", async () => {
  (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "123" } });
  const request = new Request("http://localhost/api/my-route");
  const response = await GET(request);
  const data = await response.json();
  expect(data.data).toBeTruthy();
});
```

#### 4. Unit Tests (pure functions)

```typescript
import { myFunction } from "@/lib/my-utils";

it("should return expected output", () => {
  expect(myFunction(input)).toBe(expectedOutput);
});

it("should handle edge cases", () => {
  expect(myFunction(null)).toBeNull();
  expect(myFunction("")).toBe("");
});
```

#### 5. Strategy/Validation Tests

```typescript
it("should validate correct data", () => {
  const strategy = new MyStrategy();
  const result = strategy.validate({ name: "Test", email: "test@test.com" });
  expect(result.success).toBe(true);
  expect(result.data).toEqual({ name: "Test", email: "test@test.com" });
});

it("should reject invalid data", () => {
  const strategy = new MyStrategy();
  const result = strategy.validate({ name: "" });
  expect(result.success).toBe(false);
  expect(result.error).toBeTruthy();
});
```

#### 6. Mapper Tests

```typescript
it("should map model to domain type", () => {
  const mockModel = { _id: { toString: () => "123" }, name: "Test" };
  const result = toDomainType(mockModel as unknown as IModel);
  expect(result.id).toBe("123");
  expect(result.name).toBe("Test");
});
```

### Coverage Mínimo

| Camada | Cobertura Mínima |
|---|---|
| Hooks | 100% dos hooks testados |
| Strategies/Validation | 100% dos cenários (valid/invalid) |
| Mappers | 100% dos mapeamentos |
| Controllers | 100% dos endpoints (auth, validation, success, error) |
| Services | 100% dos use cases |
| Components | Fluxos principais (render, interaction, error) |
| Pages | Fluxos principais |

### Comandos

```bash
npm test                    # Roda todos
npm test -- --watch         # Watch mode
npm test -- --coverage      # Com coverage
npm test -- path/to/file    # Arquivo específico
```

---

## 3. Skeleton — Estados de Loading

### Regra

Toda page que busca dados deve ter um skeleton. O skeleton deve ser um componente separado em `components/skeleton/`.

### Primitivas Disponíveis

```typescript
import {
  Skeleton,        // Bloco genérico
  SkeletonCircle,  // Círculo (avatar)
  SkeletonSquare,  // Quadrado (ícone)
  SkeletonLine,    // Linha de texto
  SkeletonCard,    // Card container
  SkeletonMenuItem // Item de menu (ícone + 2 linhas)
} from "@/components/ui/skeleton";
```

### Padrão por Tipo de Page

#### Page com Card + Lista

```tsx
// <feature>/components/skeleton/skeleton.component.tsx
function FeatureSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard>
        <Skeleton className="h-24 rounded-none" />
        <div className="px-6 pb-6 -mt-12 mb-4 relative">
          <SkeletonCircle className="h-24 w-24 ring-4 ring-background" />
          <SkeletonLine className="h-5 w-32 mt-4 mb-2" />
          <SkeletonLine className="h-4 w-48" />
        </div>
      </SkeletonCard>

      {[...Array(3)].map((_, i) => (
        <SkeletonMenuItem key={i} />
      ))}

      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
```

#### Page com Grid de Cards

```tsx
function PlacesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i}>
          <Skeleton className="h-40 rounded-none" />
          <div className="p-4 space-y-2">
            <SkeletonLine className="h-5 w-40" />
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-3 w-24" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}
```

#### Page com Formulário

```tsx
function FormSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonLine className="h-8 w-48" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonLine className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
```

### Regras

- Skeleton deve espelhar a estrutura real da página
- Usar `animate-pulse` (já vem nas primitivas)
- Evitar layouts que pulam (CLS) — manter mesmas dimensões
- O skeleton fica em `components/skeleton/skeleton.component.tsx`
- A view de loading fica em `views/<feature>-loading/<feature>.loading.view.tsx`

---

## 4. Acessibilidade (a11y)

### Regras Gerais

#### Labels e Inputs

Todo input deve ter label associado via `htmlFor`/`id`:

```tsx
// ✓ Correto
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// ✗ Errado
<label>Email</label>
<input type="email" />
```

#### Imagens

Toda imagem deve ter `alt`:

```tsx
// ✓ Correto
<AvatarImage src={url} alt={userName} />
<img src={url} alt={placeName} />

// ✗ Errado
<AvatarImage src={url} />
<img src={url} />
```

#### Botões e Links

Usar semântica HTML correta:

```tsx
// ✓ Correto
<Button type="submit">Salvar</Button>
<Link href="/login">Entrar</Link>

// ✗ Errado
<div onClick={handleSubmit}>Salvar</div>
<a href="/login">Entrar</a>
```

#### Títulos e Hierarquia

Manter hierarquia de heading:

```tsx
<Heading as="h1" variant="page">Título da Page</Heading>
<Heading as="h2" variant="section">Seção</Heading>
<Heading as="h3" variant="card">Card Title</Heading>
```

### Atributos Obrigatórios

| Elemento | Atributo | Exemplo |
|---|---|---|
| `<Input>` | `id` + `<Label htmlFor>` | `<Label htmlFor="email">` + `<Input id="email">` |
| `<img>` | `alt` | `<img alt="Foto do lugar">` |
| `<AvatarImage>` | `alt` | `<AvatarImage alt={userName}>` |
| `<Button>` | `type` | `<Button type="submit">` |
| Password toggle | `aria-label` | `<button aria-label="Mostrar senha">` |
| Erros de form | `aria-invalid` + `aria-describedby` | Via `FormField` component |

### Componente FormField

Usar o componente `FormField` para campos com erro:

```tsx
<FormField
  htmlFor="email"
  label="Email"
  error={errors.email}
>
  <Input
    id="email"
    type="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
</FormField>
```

### Checklist de Acessibilidade

- [ ] Todo input tem label com `htmlFor`/`id`
- [ ] Toda imagem tem `alt`
- [ ] Botões usam `<button>` ou `<Button>`, nunca `<div onClick>`
- [ ] Links usam `<a>` ou `<Link>`, nunca `<div onClick>`
- [ ] Títulos seguem hierarquia h1 > h2 > h3
- [ ] Password toggle tem `aria-label`
- [ ] Erros de form usam `aria-invalid` + `aria-describedby`
- [ ] Skeletons têm `data-slot="skeleton"` (já tem)
- [ ] Navegação por teclado funciona (tab, enter, escape)

### Testes de Acessibilidade

```typescript
// Usar queries semânticas em vez de testid
expect(screen.getByRole("button", { name: /submit/i })).toBeTruthy();
expect(screen.getByLabelText("Email")).toBeTruthy();
expect(screen.getByRole("link", { name: /entrar/i })).toBeTruthy();

// Verificar erros acessíveis
await waitFor(() => {
  expect(screen.getByText("Email inválido")).toBeTruthy();
});
```

---

## 5. Documentação Swagger/OpenAPI

### Localização

`src/lib/openapi.ts` — documento OpenAPI 3.0.3 estático.

### Regras por Rota

Toda rota API deve ser documentada no Swagger com:

1. **Tags** — agrupamento lógico
2. **Summary** — descrição curta
3. **Description** — descrição detalhada
4. **Security** — autenticação necessária
5. **Request Body** — schema do body (para PUT/PATCH/POST)
6. **Responses** — todos os códigos possíveis (200, 400, 401, 404, 500)
7. **Schemas** — models reutilizáveis em `components/schemas`

### Estrutura

```typescript
const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "API duo-app",
    description: "API para gerenciamento de places, perfil e casais",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/user": {
      get: { /* ... */ },
      put: { /* ... */ },
      patch: { /* ... */ },
    },
    "/api/places": {
      get: { /* ... */ },
      post: { /* ... */ },
      put: { /* ... */ },
      delete: { /* ... */ },
    },
    // ... outras rotas
  },
  components: {
    securitySchemes: {
      session: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
      },
    },
    schemas: {
      UserData: { /* ... */ },
      PlaceData: { /* ... */ },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", description: "Mensagem de erro" },
        },
      },
    },
  },
};
```

### Padrão por Método

#### GET

```typescript
get: {
  tags: ["Resource"],
  summary: "Listar resources",
  description: "Retorna todos os resources do casal autenticado",
  security: [{ session: [] }],
  responses: {
    "200": {
      description: "Lista de resources",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/ResourceData" },
              },
            },
          },
        },
      },
    },
    "401": {
      description: "Não autenticado",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" },
        },
      },
    },
  },
},
```

#### POST/PUT

```typescript
put: {
  tags: ["Resource"],
  summary: "Atualizar resource",
  security: [{ session: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateResourceRequest" },
      },
    },
  },
  responses: {
    "200": { /* ... */ },
    "400": {
      description: "Dados inválidos",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" },
        },
      },
    },
    "401": { /* ... */ },
  },
},
```

### Schemas

Cada entidade principal tem schema:

```typescript
schemas: {
  UserData: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      image: { type: "string", nullable: true },
      bannerColor: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
}
```

### Endpoints a Documentar

| Rota | Métodos | Status |
|---|---|---|
| `/api/user` | GET, PUT, PATCH | ✅ Documentado |
| `/api/places` | GET, POST, PUT, DELETE | ❌ Pendente |
| `/api/categories` | GET, POST, PUT, DELETE | ❌ Pendente |
| `/api/couple` | GET, PUT, POST | ❌ Pendente |
| `/api/comments` | GET, POST, DELETE | ❌ Pendente |
| `/api/stats` | GET | ❌ Pendente |
| `/api/upload` | POST | ❌ Pendente |

### Acessando o Swagger

```
GET /api/docs → UI do Swagger
GET /api/user?openapi=true → JSON do OpenAPI spec
```

---

## 6. Checklist de PR

Antes de criar um PR, verificar:

### Código

- [ ] Zero `any` no código production
- [ ] TypeScript compila sem erros (`npx tsc --noEmit`)
- [ ] ESLint passa sem warnings

### Testes

- [ ] Testes escritos para hooks novos
- [ ] Testes escritos para strategies/mappers novos
- [ ] Testes escritos para controllers/services novos
- [ ] Testes escritos para components novos
- [ ] Todos os testes passam (`npm test`)

### UI

- [ ] Page tem skeleton para estado de loading
- [ ] Todo input tem label com `htmlFor`/`id`
- [ ] Toda imagem tem `alt`
- [ ] Botões e links usam semântica HTML
- [ ] Títulos seguem hierarquia

### API

- [ ] Rota documentada no Swagger
- [ ] Schemas definidos em `components/schemas`
- [ ] Responses documentados (200, 400, 401, 404)

### Estrutura

- [ ] Pages seguem padrão MVVM (se complexas)
- [ ] API segue padrão Clean Architecture (se complexa)
- [ ] Arquivos命名 follow conventions (`.component.tsx`, `.view.tsx`, `.hook.ts`)
- [ ] Componentes em pasta `components/` com sufixo `.component.tsx`
- [ ] Views em pasta `views/` com sufixo `.view.tsx`
