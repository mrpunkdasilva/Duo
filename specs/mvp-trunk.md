# Spec MVP Trunk — duo

## 1. Visão Geral

### O que é o MVP Trunk

O MVP Trunk é a versão mínima viável do duo que adiciona **diferenciais competitivos** ao produto. Enquanto o MVP atual (já implementado) entrega a funcionalidade base, o Trunk entrega a **experiência** que faz o usuário voltar.

### Objetivo

Transformar o duo de "app de listas" para "app de experiência" — com mapa, memórias, gamificação e engajamento.

### Métricas de Sucesso

| Métrica | Meta |
|---|---|
| DAU/MAU | > 30% |
| Retenção D7 | > 25% |
| Sessões/semanais | > 3 por casal |
| Streak médio | > 2 semanas |

---

## 2. Features Existentes (Inventário)

| Feature | Status | Arquivos |
|---|---|---|
| Auth (email/senha) | ✅ | `src/app/(auth)/`, `src/app/api/auth/` |
| Vinculação de casal | ✅ | `src/app/(protected)/partner/`, `src/app/api/couple/` |
| CRUD lugares | ✅ | `src/app/(protected)/places/`, `src/app/api/places/` |
| Rating 4 dimensões | ✅ | `src/components/features/star-rating/` |
| Comentários | ✅ | `src/app/api/comments/` |
| Tracker filmes/séries | ✅ | `src/app/(protected)/movies/`, `src/app/api/movies/` |
| Status de assistir | ✅ | `src/app/api/movies/` (PUT) |
| Favoritos + rating casal | ✅ | `src/app/api/movies/` (PUT) |
| Categorias customizáveis | ✅ | `src/app/(protected)/categories/`, `src/app/api/categories/` |
| Dashboard + stats | ✅ | `src/app/(protected)/home/`, `src/app/api/stats/` |
| Perfil do usuário | ✅ | `src/app/(protected)/profile/` |
| Upload Cloudinary | ✅ | `src/app/api/upload/` |
| i18n pt-BR | ✅ | `i18n/locales/pt.json` |
| API docs (Swagger) | ✅ | `src/app/api/docs/` |

### Dados já existentes

O modelo `Place` já possui:
```typescript
latitude?: number;    // -90 a 90
longitude?: number;   // -180 a 180
```

Isso significa que **já podemos colocar lugares no mapa** — basta integrar o Leaflet.

---

## 3. Novas Features

---

### 3.1 Mapa Interativo

#### Descrição

Visualização de todos os lugares do casal num mapa interativo com pins coloridos por categoria, clustering, filtros e popup com detalhes.

#### User Stories

- **US-MAP-01:** Como casal, quero ver todos os lugares no mapa para ter uma visão geral de onde estão
- **US-MAP-02:** Como casal, quero filtrar os lugares por categoria no mapa
- **US-MAP-03:** Como casal, quero clicar num pin para ver detalhes do lugar
- **US-MAP-04:** Como casal, quero ver a distância entre eu e o lugar
- **US-MAP-05:** Como casal, quero marcar um lugar como visitado direto do mapa

#### Fluxo Principal

1. Usuário clica na tab "Mapa" na navegação
2. App carrega mapa centrado na última posição conhecida (ou centro da cidade)
3. Pins coloridos aparecem para cada lugar com coordenadas
4. Usuário clica num pin → popup mostra: nome, categoria, avaliação, foto miniatura
5. Usuário pode clicar "Ver detalhes" → navega para `/places/[id]`
6. Usuário pode filtrar por categoria via chips no topo do mapa

#### Fluxos Alternativos

- **Sem permissão de localização:** Mapa mostra centro da cidade como fallback
- **Lugares sem coordenadas:** Não aparecem no mapa (mostrar aviso)
- **Muitos lugares (>50):** Usar clustering (Leaflet.markercluster)

#### Componentes a Criar

| Componente | Caminho | Descrição |
|---|---|---|
| `MapView` | `src/app/(protected)/map/views/map-view/map-view.view.tsx` | View principal do mapa |
| `MapContainer` | `src/app/(protected)/map/components/map-container/map-container.component.tsx` | Wrapper do Leaflet Map |
| `PlacePin` | `src/app/(protected)/map/components/place-pin/place-pin.component.tsx` | Pin customizado no mapa |
| `MapPopup` | `src/app/(protected)/map/components/map-popup/map-popup.component.tsx` | Popup ao clicar no pin |
| `MapFilters` | `src/app/(protected)/map/components/map-filters/map-filters.component.tsx` | Chips de filtro por categoria |
| `useMap` | `src/app/(protected)/map/hooks/use-map/use-map.hook.ts` | Hook principal do mapa |
| `useGeolocation` | `src/hooks/use-geolocation/use-geolocation.hook.ts` | Hook global de geolocalização |

#### API

```
GET /api/places?lat={lat}&lng={lng}&radius={km}&category={cat}
```

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Pizzaria Augusta",
      "category": "restaurante",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "photoUrl": "...",
      "rating": { "ambiente": 4, "romance": 5, "custo": 3, "experiencia": 4 },
      "visited": false
    }
  ]
}
```

#### Modelos

Não precisa de novo schema. Usa `Place` existente com `latitude` e `longitude`.

#### Bibliotecas

| Biblioteca | Versão | Uso |
|---|---|---|
| `leaflet` | latest | Mapa base |
| `react-leaflet` | latest | Wrapper React |
| `@types/leaflet` | latest | Tipos |

#### UI/UX

```
┌─────────────────────────────┐
│ [Mapa]  Lugares  Filmes Duo │  ← Nav existente
├─────────────────────────────┤
│ [🍽️] [🏖️] [🏛️] [🌳] [☕]  │  ← Filtros por categoria
├─────────────────────────────┤
│                             │
│      📍      📍             │
│         📍                  │  ← Mapa com pins
│    📍         📍            │
│                             │
├─────────────────────────────┤
│ 📍 Pizzaria Augusta    ★4.5 │  ← Bottom sheet (popup)
│ Restaurante • 2.3km         │
│ [Ver detalhes]              │
└─────────────────────────────┘
```

#### Estimativa: 3 dias

---

### 3.2 Geolocalização

#### Descrição

Obter a posição atual do usuário para centralizar o mapa e calcular distâncias até os lugares.

#### User Stories

- **US-GEO-01:** Como casal, quero que o mapa abra na minha posição atual
- **US-GEO-02:** Como casal, quero ver a distância de cada lugar até mim
- **US-GEO-03:** Como casal, quero buscar lugares próximos (raio configurável)

#### Fluxo Principal

1. App solicita permissão de localização
2. Usuário aprova
3. App obtém coordenadas via `navigator.geolocation.getCurrentPosition`
4. Mapa centra na posição do usuário
5. Distância é calculada para cada lugar usando fórmula de Haversine

#### Fluxos Alternativos

- **Permissão negada:** Mapa centra em São Paulo (fallback)
- **GPS desativado:** Mostrar aviso "Ative a localização para ver lugares próximos"
- **Erro de geolocalização:** Retry uma vez, senão fallback

#### Componentes a Criar

| Componente | Caminho | Descrição |
|---|---|---|
| `useGeolocation` | `src/hooks/use-geolocation/use-geolocation.hook.ts` | Hook global (singleton) |
| `LocationButton` | `src/components/ui/location-button.tsx` | Botão "Minha posição" no mapa |

#### Hook

```typescript
// use-geolocation.hook.ts
export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPosition(pos); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { position, error, loading };
}
```

#### Utilitário

```typescript
// lib/geo.ts
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  // Retorna distância em km
}
```

#### Estimativa: 1 dia

---

### 3.3 Timeline Visual

#### Descrição

Linha do tempo cronológica mostrando todos os marcos do casal: lugares visitados, filmes assistidos, memórias criadas.

#### User Stories

- **US-TL-01:** Como casal, quero ver uma linha do tempo com todos os nossos marcos
- **US-TL-02:** Como casal, quero navegar por mês/ano na timeline
- **US-TL-03:** Como casal, quero ver fotos e textos nas memórias da timeline
- **US-TL-04:** Como casal, quero filtrar a timeline por tipo (lugar, filme, memória)

#### Fluxo Principal

1. Usuário acessa `/timeline` ou clica "Timeline" no dashboard
2. App carrega todos os registros cronologicamente
3. Timeline mostra:数据 separators por mês, cards com foto/título/data
4. Usuário pode scrollar verticalmente
5. Usuário pode clicar num card → navega para detalhe

#### Fluxos Alternativos

- **Sem registros:** Estado vazio "Adicione seu primeiro lugar para começar a timeline"
- **Muitos registros (>100):** Virtual scrolling ou paginação

#### Componentes a Criar

| Componente | Caminho | Descrição |
|---|---|---|
| `TimelineView` | `src/app/(protected)/timeline/views/timeline-view/timeline-view.view.tsx` | View principal |
| `TimelineItem` | `src/app/(protected)/timeline/components/timeline-item/timeline-item.component.tsx` | Item individual |
| `TimelineMonth` | `src/app/(protected)/timeline/components/timeline-month/timeline-month.component.tsx` | Separador de mês |
| `TimelineEmpty` | `src/app/(protected)/timeline/components/timeline-empty/timeline-empty.component.tsx` | Estado vazio |
| `useTimeline` | `src/app/(protected)/timeline/hooks/use-timeline/use-timeline.hook.ts` | Hook de dados |

#### API

```
GET /api/timeline?coupleId={id}&month={YYYY-MM}&type={place|movie|memory}
```

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "type": "place",
      "title": "Pizzaria Augusta",
      "date": "2026-08-15",
      "photo": "...",
      "description": "Primeira pizza juntos",
      "rating": 4.5
    }
  ]
}
```

#### Modelos

```typescript
// TimelineItem (derivado, não precisa de schema novo)
interface TimelineItem {
  id: string;
  type: "place" | "movie" | "memory";
  title: string;
  date: string;
  photo?: string;
  description?: string;
  rating?: number;
  sourceId: string; // ID do Place ou Movie original
}
```

#### UI/UX

```
┌─────────────────────────────┐
│ Timeline              [Filt] │
├─────────────────────────────┤
│ ─── Agosto 2026 ────────── │
│                             │
│  📍 Pizzaria Augusta        │
│  📸 [foto]                  │
│  "Primeira pizza juntos"    │
│  ★★★★☆                     │
│                             │
│  🎬 O Tempo                 │
│  📸 [poster]                │
│  ★★★★★                     │
│                             │
│ ─── Julho 2026 ─────────── │
│  📍 Praia da LUA            │
│  📸 [foto]                  │
└─────────────────────────────┘
```

#### Estimativa: 3 dias

---

### 3.4 Timecapsule

#### Descrição

Ao marcar um lugar como "visitado", o app convida o casal a criar uma memória: foto + texto curto. Essa memória aparece na timeline e no detalhe do lugar.

#### User Stories

- **US-TC-01:** Como casal, quero adicionar uma foto e texto quando visito um lugar
- **US-TC-02:** Como casal, quero ver as memórias no detalhe do lugar
- **US-TC-03:** Como casal, quero que a memória apareça na timeline

#### Fluxo Principal

1. Usuário marca um lugar como "visitado"
2. App mostra modal: "Criar memória?"
3. Usuário pode:
   - Adicionar foto (upload Cloudinary)
   - Escrever texto curto (max 200 chars)
   - Pular (cria memória só com foto do lugar)
4. Memória é salva e aparece na timeline

#### Fluxos Alternativos

- **Pular:** Memória criada automaticamente com foto do lugar + data
- **Erro no upload:** Permite salvar sem foto

#### Componentes a Criar

| Componente | Caminho | Descrição |
|---|---|---|
| `TimecapsulePrompt` | `src/app/(protected)/places/components/timecapsule-prompt/timecapsule-prompt.component.tsx` | Modal de criação |
| `TimecapsuleCard` | `src/app/(protected)/places/components/timecapsule-card/timecapsule-card.component.tsx` | Card na timeline |

#### Modelo

```typescript
// Adicionar ao schema Place
interface Place {
  // ... existente
  memory?: {
    photo?: string;
    text?: string;
    createdAt: Date;
  };
}
```

#### UI/UX

```
┌─────────────────────────────┐
│     Criar Memória 📸        │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │    [Adicionar foto]   │  │
│  └───────────────────────┘  │
│                             │
│  "Escreva sobre esse momento"│
│  ┌───────────────────────┐  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  [Pular]     [Salvar]       │
└─────────────────────────────┘
```

#### Estimativa: 2 dias

---

### 3.5 Badges/Conquistas

#### Descrição

Sistema de gamificação com badges que o casal desbloqueia ao atingir marcos. Cada ação gera XP e sobe o nível do casal.

#### User Stories

- **US-BG-01:** Como casal, quero ver nossas conquistas/badges
- **US-BG-02:** Como casal, quero ganhar badges ao atingir marcos
- **US-BG-03:** Como casal, quero ver o progresso para o próximo badge
- **US-BG-04:** Como casal, quero ver o nível e XP atual

#### Sistema de XP

| Ação | XP |
|---|---|
| Adicionar lugar | 10 XP |
| Marcar como visitado | 20 XP |
| Criar memória | 15 XP |
| Adicionar filme | 10 XP |
| Assistir filme | 20 XP |
| Favoritar filme | 5 XP |
| Comentar | 5 XP |
| Streak semanal (+1 semana) | 50 XP |

#### Badges

| Badge | Condição | Ícone |
|---|---|---|
| Explorador | 10 lugares visitados | 🗺️ |
| Cinéfilo | 50 filmes assistidos | 🎬 |
| Memória | 20 memórias criadas | 📸 |
| Streak | 4 semanas consecutivas | 🔥 |
| Crítico | 100 avaliações dadas | ⭐ |
| Social | 10 comentários | 💬 |
| Viajante | Lugares em 3 cidades | ✈️ |
| Curador | 10 categorias criadas | 📂 |
| Casal Elite | Nível 10 | 👑 |
| Lenda | Nível 25 | 🏆 |

#### Níveis

| Nível | XP Necessário |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 500 |
| 5 | 1.000 |
| 10 | 5.000 |
| 25 | 25.000 |
| 50 | 100.000 |

#### Componentes a Criar

| Componente | Caminho | Descrição |
|---|---|---|
| `BadgesView` | `src/app/(protected)/badges/views/badges-view/badges-view.view.tsx` | View principal |
| `BadgeCard` | `src/app/(protected)/badges/components/badge-card/badge-card.component.tsx` | Card de badge |
| `XPBar` | `src/app/(protected)/badges/components/xp-bar/xp-bar.component.tsx` | Barra de progresso XP |
| `LevelBadge` | `src/app/(protected)/badges/components/level-badge/level-badge.component.tsx` | Badge de nível |
| `useBadges` | `src/app/(protected)/badges/hooks/use-badges/use-badges.hook.ts` | Hook de lógica |

#### API

```
GET /api/badges?coupleId={id}
```

**Response:**
```json
{
  "data": {
    "level": 5,
    "xp": 1250,
    "xpToNext": 2000,
    "badges": [
      { "id": "explorer", "name": "Explorador", "unlockedAt": "2026-08-15", "progress": 10, "target": 10 },
      { "id": "cinephile", "name": "Cinéfilo", "progress": 32, "target": 50 }
    ]
  }
}
```

#### Modelo

```typescript
// src/models/user-badge.ts
interface IUserBadge extends Document {
  coupleId: mongoose.Types.ObjectId;
  xp: number;
  level: number;
  badges: [{
    id: string;
    unlockedAt?: Date;
    progress: number;
  }];
  streak: number;
  lastActivity: Date;
}
```

#### UI/UX

```
┌─────────────────────────────┐
│ Conquistas                  │
├─────────────────────────────┤
│ Nível 5 ████████░░ 1250/2000│
├─────────────────────────────┤
│                             │
│  🗺️ Explorador    ✅        │
│  10/10 lugares visitados    │
│                             │
│  🎬 Cinéfilo      🔒        │
│  32/50 filmes assistidos    │
│  ████████████░░░░ 64%       │
│                             │
│  📸 Memória       🔒        │
│  5/20 memórias criadas      │
│  █████░░░░░░░░░░░ 25%       │
│                             │
│  🔥 Streak        ✅        │
│  6 semanas consecutivas     │
└─────────────────────────────┘
```

#### Estimativa: 2 dias

---

### 3.6 Lembretes Push

#### Descrição

Notificações push para engajar o casal: lembretes de lugares não visitados, streaks, badges próximos, sugestões.

#### User Stories

- **US-NF-01:** Como casal, quero receber lembretes de lugares que não visitamos
- **US-NF-02:** Como casal, quero ser notificado quando um badge está próximo
- **US-NF-03:** Como casal, quero configurar a frequência dos lembretes

#### Tipos de Notificação

| Tipo | Trigger | Exemplo |
|---|---|---|
| Lembrete de lugar | 7 dias sem visitar | "Vocês não visitam um lugar há 2 semanas. Que tal um date?" |
| Streak | Streak quebrada | "Sua streak de 4 semanas foi quebrada! Voltem a visitar lugares!" |
| Badge próximo | 80%+ de um badge | "Faltam 2 lugares para desbloquear 'Explorador'!" |
| Sugestão | Baseado em Preferências | "Baseado nos seus gostos, experimentem: Café Floresta" |
| Semanal | Toda sexta | "Resumo da semana: 2 lugares visitados, 1 filme assistido" |

#### Fluxo Principal

1. Usuário ativa notificações nas configurações
2. App registra token FCM no backend
3. Backend agenda/verifica triggers diariamente
4. Notificação é enviada via Firebase Cloud Messaging
5. Usuário clica → navega para a feature relevante

#### Fluxos Alternativos

- **Permissão negada:** Mostrar banner "Ative notificações para não perder nada"
- **Token expirado:** Re-registrar token automaticamente

#### Componentes a Criar

| Componente | Caminho | Descrição |
|---|---|---|
| `NotificationSettings` | `src/app/(protected)/profile/components/notification-settings/notification-settings.component.tsx` | Toggle de config |
| `useNotifications` | `src/hooks/use-notifications/use-notifications.hook.ts` | Hook de registro |

#### API

```
POST /api/notifications/subscribe
Body: { token: string, preferences: { reminders: boolean, streaks: boolean, badges: boolean } }

GET /api/notifications/preferences?coupleId={id}
```

#### Modelo

```typescript
// Adicionar ao schema User
interface User {
  // ... existente
  notificationToken?: string;
  notificationPreferences?: {
    reminders: boolean;
    streaks: boolean;
    badges: boolean;
    suggestions: boolean;
    weekly: boolean;
  };
}
```

#### Bibliotecas

| Biblioteca | Versão | Uso |
|---|---|---|
| `firebase` | latest | Client-side FCM |
| `firebase-admin` | latest | Server-side push |

#### Estimativa: 2 dias

---

## 4. Priorização MoSCoW

### Must Have (MVP Trunk)

- [ ] Mapa interativo com pins
- [ ] Geolocalização
- [ ] Timeline visual
- [ ] Timecapsule (memórias)

### Should Have

- [ ] Badges/Conquistas
- [ ] Lembretes push

### Could Have

- [ ] clustering no mapa
- [ ] Filtros avançados no mapa
- [ ] Notificações semanais por email

### Won't Have (neste ciclo)

- [ ] IA/Recomendações
- [ ] Patrocínio
- [ ] App nativo

---

## 5. Dependências

```
Mapa Interativo
├── Geolocalização (obrigatório)
└── Places API existente

Timeline
├── Places API existente
├── Movies API existente
└── Timecapsule (para memórias)

Timecapsule
├── Places API existente
└── Upload Cloudinary existente

Badges
├── Places API existente
├── Movies API existente
└── Novo schema UserBadge

Lembretes Push
├── Firebase setup
└── User schema (notificationToken)
```

---

## 6. Definição de Pronto

O MVP Trunk está pronto quando:

- [ ] Mapa mostra todos os lugares com pins coloridos
- [ ] Geolocalização funciona (ou fallback para centro)
- [ ] Filtros por categoria funcionam no mapa
- [ ] Timeline mostra lugares + filmes cronologicamente
- [ ] Timecapsule permite criar memória ao visitar
- [ ] Badges são desbloqueados automaticamente
- [ ] XP e nível são calculados corretamente
- [ ] Notificações push são enviadas (pelo menos lembrete + semanal)
- [ ] Todos os testes passam
- [ ] Zero `any` no código
- [ ] i18n funcionando para todas as strings
- [ ] Mobile-first responsivo

---

## 7. Estimativa Total

| Feature | Dias |
|---|---|
| Mapa interativo | 3 |
| Geolocalização | 1 |
| Timeline | 3 |
| Timecapsule | 2 |
| Badges | 2 |
| Lembretes | 2 |
| Integração + testes | 1 |
| **Total** | **14 dias (3 semanas)** |

---

## 8. Ordem de Implementação

```
Semana 1:
├── Dia 1-2: Geolocalização + setup Leaflet
├── Dia 3-4: Mapa interativo (pins, filtros, popup)
└── Dia 5: Integração mapa + testes

Semana 2:
├── Dia 6-7: Timeline visual
├── Dia 8-9: Timecapsule
└── Dia 10: Integração timeline + testes

Semana 3:
├── Dia 11-12: Badges/Conquistas
├── Dia 13: Lembretes push
└── Dia 14: Integração final + testes + polish
```
