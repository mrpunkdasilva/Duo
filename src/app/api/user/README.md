# API User Module

## Arquitetura

```
api/user/
├── route.ts                    → Camada fina (handlers HTTP)
├── controllers/
│   └── user.controller.ts      → Orquestra use cases
├── dto/
│   ├── user-request.dto.ts     → Data Transfer Objects (entrada)
│   └── user-response.dto.ts    → Data Transfer Objects (saída)
├── infra/
│   └── user.repository.ts      → Acesso a dados (MongoDB)
├── mapper/
│   └── user.mapper.ts          → Conversão domain ↔ DTO
├── services/
│   └── user.service.ts         → Lógica de negócio
├── strategies/
│   ├── validation.strategy.ts  → Interface de validação
│   └── user-type.strategy.ts   → Strategies concretas
└── types/
    └── user.types.ts           → Tipos de domínio
```

## Fluxo de Requisição

```
HTTP Request
    ↓
route.ts (Next.js handlers)
    ↓
controller (auth + orchestration)
    ↓
strategies (validation)
    ↓
services (business logic)
    ↓
infra (database)
    ↓
mapper (domain → DTO)
    ↓
HTTP Response
```

## Endpoints

### GET /api/user

Retorna o perfil do usuário autenticado.

**Response:**
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "image": "string | null",
    "bannerColor": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Erros:**
- `401` - Não autenticado
- `404` - Usuário não encontrado

---

### PUT /api/user

Atualiza o perfil do usuário.

**Request Body:**
```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "image": "string (opcional)",
  "bannerColor": "string (opcional)"
}
```

**Response:**
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "image": "string | null",
    "bannerColor": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado

---

### PATCH /api/user

Altera a senha do usuário.

**Request Body:**
```json
{
  "currentPassword": "string (obrigatório)",
  "newPassword": "string (mínimo 6 caracteres)"
}
```

**Response:**
```json
{
  "data": {
    "success": true
  }
}
```

**Erros:**
- `400` - Senha atual incorreta ou dados inválidos
- `401` - Não autenticado

## Observabilidade

Logs via Pino (`src/lib/logger.ts`):

```typescript
// Info
logger.info({ userId }, "Fetching user");
logger.info("GET /api/user - Fetching profile");

// Warning
logger.warn({ userId }, "User not found");
logger.warn("Unauthorized access attempt");

// Error
logger.error({ userId, error: message }, "Error updating profile");
```

## Validação (Strategy Pattern)

```typescript
// Interface
interface ValidationStrategy<T> {
  validate: (data: unknown) => ValidationResult<T>;
}

// Uso
const strategy = new UpdateProfileStrategy();
const result = validateWithStrategy(strategy, body);

if (!result.success) {
  return { status: 400, body: { error: result.error } };
}
// result.data está tipado como UpdateProfileDto
```
