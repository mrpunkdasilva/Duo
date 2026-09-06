# Spec Integração Google Maps — duo

## 1. Visão Geral

Integração completa do Google Maps Platform no duo para oferecer mapa interativo, geocoding, busca de lugares próximos, directions e street view.

### APIs Habilitadas

| API | SKU | Free/mês | Custo adicional |
|---|---|---|---|
| Maps JavaScript API | Dynamic Maps | 10.000 loads | $7,00/1K |
| Geocoding API | Geocoding | 10.000 requests | $5,00/1K |
| Places API | Autocomplete | 5.000-10.000 | $2,83/1K |
| Places API | Nearby Search | 5.000 | $32,00/1K |
| Places API | Place Details | 10.000 | $5,00/1K |
| Directions API | Compute Routes | 10.000 | $5,00/1K |
| Street View | Static Street View | 10.000 | $7,00/1K |

### Cenários de Custo

| Escala | Usuários | Custo/mês estimado |
|---|---|---|
| MVP | 1K | $0 (dentro do free tier) |
| Crescimento | 10K | ~$50-100 |
| Escala | 100K | ~$500-1.000 |

---

## 2. Setup

### 2.1 Google Cloud Console

1. Criar projeto "duo-app" no Google Cloud Console
2. Habilitar as APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API
   - Street View Static API
3. Criar API key em Credentials
4. Restringir a key:
   - HTTP referrers: `localhost:3000`, `*.vercel.app`, seu domínio
5. Configurar billing account
6. Definir alertas de billing ($50, $100, $200)

### 2.2 Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_api_key_aqui
```

### 2.3 Pacotes

```bash
npm install @vis.gl/react-google-maps
npm install @googlemaps/markerclusterer
npm install -D @types/google.maps
```

---

## 3. Arquitetura

```
src/
├── app/
│   ├── providers.tsx                    # Adicionar MapProvider
│   └── (protected)/
│       └── map/                         # NOVA FEATURE
│           ├── page.tsx                 # Entry point
│           ├── loading.tsx              # Skeleton
│           ├── types/
│           │   └── map.types.ts
│           ├── hooks/
│           │   ├── use-map/
│           │   │   └── use-map.hook.ts
│           │   └── use-map-filters/
│           │       └── use-map-filters.hook.ts
│           ├── views/
│           │   └── map-view/
│           │       └── map-view.view.tsx
│           └── components/
│               ├── map-container/
│               │   └── map-container.component.tsx
│               ├── place-marker/
│               │   └── place-marker.component.tsx
│               ├── place-info-window/
│               │   └── place-info-window.component.tsx
│               ├── map-filters/
│               │   └── map-filters.component.tsx
│               ├── search-bar/
│               │   └── search-bar.component.tsx
│               └── map-skeleton/
│                   └── map-skeleton.component.tsx
├── hooks/
│   └── use-geolocation/
│       └── use-geolocation.hook.ts
├── lib/
│   ├── geocoding.ts                     # Geocoding utilities
│   └── places.ts                        # Places utilities
└── components/
    └── layout/
        └── mobile-nav/
            └── index.tsx                # Adicionar tab "Mapa"
```

---

## 4. Componentes

### 4.1 MapProvider

Wrapper global para carregar a API do Google Maps.

```typescript
// src/app/providers.tsx
"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale="pt" timeZone="America/Sao_Paulo">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </APIProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
```

### 4.2 MapContainer

Wrapper do componente Map do Google Maps.

```typescript
// map-container.component.tsx
"use client";

import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface MapContainerProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  places: Place[];
  selectedCategory: string | null;
  onPlaceClick: (place: Place) => void;
}

export function MapContainer({
  center,
  zoom,
  places,
  selectedCategory,
  onPlaceClick,
}: MapContainerProps) {
  return (
    <Map
      defaultCenter={center}
      defaultZoom={zoom}
      mapId="duo-map"
      gestureHandling="greedy"
      disableDefaultUI={true}
      zoomControl={true}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={false}
    >
      {places
        .filter((p) => !selectedCategory || p.category === selectedCategory)
        .map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            onClick={() => onPlaceClick(place)}
          />
        ))}
    </Map>
  );
}
```

### 4.3 PlaceMarker

Pin colorido por categoria.

```typescript
// place-marker.component.tsx
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const CATEGORY_COLORS: Record<string, string> = {
  restaurante: "#fb923c",
  praia: "#60a5fa",
  museu: "#a78bfa",
  parque: "#4ade80",
  cafeteria: "#fbbf24",
  bar: "#f472b6",
  loja: "#a78bfa",
};

interface PlaceMarkerProps {
  place: Place;
  onClick: () => void;
}

export function PlaceMarker({ place, onClick }: PlaceMarkerProps) {
  if (!place.latitude || !place.longitude) return null;

  return (
    <AdvancedMarker
      position={{ lat: place.latitude, lng: place.longitude }}
      onClick={onClick}
    >
      <Pin
        background={CATEGORY_COLORS[place.category] || "#FF6B6B"}
        borderColor="#fff"
        glyphColor="#fff"
      />
    </AdvancedMarker>
  );
}
```

### 4.4 PlaceInfoWindow

Popup ao clicar no pin.

```typescript
// place-info-window.component.tsx
import { InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Navigation } from "lucide-react";

interface PlaceInfoWindowProps {
  place: Place;
  onClose: () => void;
  onViewDetails: () => void;
  onDirections: () => void;
}

export function PlaceInfoWindow({
  place,
  onClose,
  onViewDetails,
  onDirections,
}: PlaceInfoWindowProps) {
  const avgRating = place.rating
    ? (place.rating.ambiente + place.rating.romance + place.rating.custo + place.rating.experiencia) / 4
    : 0;

  return (
    <InfoWindow
      position={{ lat: place.latitude!, lng: place.longitude! }}
      onCloseClick={onClose}
    >
      <div className="p-3 min-w-[200px]">
        {place.photoUrl && (
          <img
            src={place.photoUrl}
            alt={place.name}
            className="w-full h-24 object-cover rounded-lg mb-2"
          />
        )}
        <h3 className="font-medium text-sm">{place.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {place.category}
          </Badge>
          {avgRating > 0 && (
            <span className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={onViewDetails}>
            Ver detalhes
          </Button>
          <Button size="sm" variant="outline" onClick={onDirections}>
            <Navigation className="h-3 w-3 mr-1" />
            Rotas
          </Button>
        </div>
      </div>
    </InfoWindow>
  );
}
```

### 4.5 MapFilters

Filtros por categoria com chips.

```typescript
// map-filters.component.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "restaurante", label: "Restaurante", icon: "🍽️" },
  { id: "praia", label: "Praia", icon: "🏖️" },
  { id: "museu", label: "Museu", icon: "🏛️" },
  { id: "parque", label: "Parque", icon: "🌳" },
  { id: "cafeteria", label: "Cafeteria", icon: "☕" },
  { id: "bar", label: "Bar", icon: "🍸" },
  { id: "loja", label: "Loja", icon: "🛍️" },
];

interface MapFiltersProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function MapFilters({ selected, onSelect }: MapFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className={cn(
          "cursor-pointer whitespace-nowrap",
          selected === null && "bg-duo-rose text-white"
        )}
        onClick={() => onSelect(null)}
      >
        Todos
      </Badge>
      {CATEGORIES.map((cat) => (
        <Badge
          key={cat.id}
          variant={selected === cat.id ? "default" : "outline"}
          className={cn(
            "cursor-pointer whitespace-nowrap",
            selected === cat.id && "bg-duo-rose text-white"
          )}
          onClick={() => onSelect(cat.id)}
        >
          {cat.icon} {cat.label}
        </Badge>
      ))}
    </div>
  );
}
```

### 4.6 SearchBar

Busca com Places Autocomplete.

```typescript
// search-bar.component.tsx
"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export function SearchBar({ onPlaceSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback(
    (auto: google.maps.places.Autocomplete) => {
      setAutocomplete(auto);
    },
    []
  );

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect(place);
        setQuery(place.name || "");
      }
    }
  };

  return (
    <div className="relative px-4">
      <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar lugar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-7 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
```

### 4.7 useGeolocation

Hook para obter posição atual.

```typescript
// use-geolocation.hook.ts
"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  position: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

const DEFAULT_CENTER = { lat: -23.5505, lng: -46.6333 }; // São Paulo

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: DEFAULT_CENTER,
        error: "Geolocalização não suportada",
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          position: DEFAULT_CENTER,
          error: error.message,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  }, []);

  return state;
}
```

### 4.8 lib/geocoding.ts

Utilitários de geocoding.

```typescript
// geocoding.ts
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export interface GeocodingResult {
  address: string;
  lat: number;
  lng: number;
}

export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();

  if (data.results.length === 0) {
    return null;
  }

  const result = data.results[0];
  return {
    address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  };
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();

  if (data.results.length === 0) {
    return null;
  }

  return data.results[0].formatted_address;
}
```

### 4.9 lib/places.ts

Utilitários de Places API.

```typescript
// places.ts
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export interface NearbyPlace {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  types: string[];
}

export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 5000,
  type?: string
): Promise<NearbyPlace[]> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  );
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", radius.toString());
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
  if (type) url.searchParams.set("type", type);

  const response = await fetch(url.toString());
  const data = await response.json();

  return data.results.map((place: any) => ({
    placeId: place.place_id,
    name: place.name,
    address: place.vicinity,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    rating: place.rating || 0,
    types: place.types,
  }));
}
```

---

## 5. View Principal

```typescript
// map-view.view.tsx
"use client";

import { useState, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { MapContainer } from "../../components/map-container/map-container.component";
import { MapFilters } from "../../components/map-filters/map-filters.component";
import { SearchBar } from "../../components/search-bar/search-bar.component";
import { PlaceInfoWindow } from "../../components/place-info-window/place-info-window.component";
import { useGeolocation } from "@/hooks/use-geolocation/use-geolocation.hook";
import { useTranslations } from "next-intl";

export function MapView({ places }: { places: Place[] }) {
  const t = useTranslations("map");
  const { position, loading } = useGeolocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    position || { lat: -23.5505, lng: -46.6333 }
  );

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.geometry?.location) {
        const loc = place.geometry.location;
        setMapCenter({ lat: loc.lat(), lng: loc.lng() });
      }
    },
    []
  );

  const handleDirections = useCallback((place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  }, []);

  if (loading) {
    return <MapSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      <SearchBar onPlaceSelect={handlePlaceSelect} />
      <MapFilters
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <div className="h-[500px] rounded-xl overflow-hidden ring-1 ring-foreground/10">
        <MapContainer
          center={mapCenter}
          zoom={13}
          places={places}
          selectedCategory={selectedCategory}
          onPlaceClick={handlePlaceClick}
        />
      </div>
      {selectedPlace && (
        <PlaceInfoWindow
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onViewDetails={() => {
            window.location.href = `/places/${selectedPlace.id}`;
          }}
          onDirections={() => handleDirections(selectedPlace)}
        />
      )}
    </PageContainer>
  );
}
```

---

## 6. Navegação

Adicionar tab "Mapa" na navegação.

### Mobile (Bottom Nav)

```typescript
// Adicionar em mobile-nav
{
  icon: <Map className="h-5 w-5" />,
  label: "Mapa",
  href: "/map",
}
```

### Desktop (Header)

```typescript
// Adicionar em header nav
<Button variant="ghost" asChild>
  <Link href="/map">Mapa</Link>
</Button>
```

---

## 7. API

### GET /api/places (atualizar)

Adicionar suporte a geo-query:

```
GET /api/places?lat={lat}&lng={lng}&radius={km}&category={cat}
```

**Query com geolocalização:**

```typescript
// Adicionar em route.ts
if (lat && lng && radius) {
  const earthRadius = 6371; // km
  const deltaLat = (radius / earthRadius) * (180 / Math.PI);
  const deltaLng =
    (radius / (earthRadius * Math.cos((lat * Math.PI) / 180))) *
    (180 / Math.PI);

  query.latitude = { $gte: lat - deltaLat, $lte: lat + deltaLat };
  query.longitude = { $gte: lng - deltaLng, $lte: lng + deltaLng };
}
```

---

## 8. UI/UX

### Layout

```
┌─────────────────────────────┐
│  🔍 Buscar lugar...         │  ← SearchBar (Autocomplete)
├─────────────────────────────┤
│ [Todos] [🍽️] [🏖️] [🏛️]    │  ← MapFilters (scroll horizontal)
├─────────────────────────────┤
│                             │
│      📍      📍             │
│         📍                  │  ← Google Map
│    📍         📍            │    (AdvancedMarker + Pin)
│                             │
├─────────────────────────────┤
│ 📍 Pizzaria Augusta         │  ← PlaceInfoWindow
│ ⭐ 4.5 • Restaurante        │    (ao clicar no pin)
│ [Ver detalhes] [Rotas]      │
└─────────────────────────────┘
```

### Cores dos Pins

| Categoria | Cor |
|---|---|
| Restaurante | `#fb923c` (orange) |
| Praia | `#60a5fa` (blue) |
| Museu | `#a78bfa` (violet) |
| Parque | `#4ade80` (green) |
| Cafeteria | `#fbbf24` (amber) |
| Bar | `#f472b6` (pink) |
| Loja | `#a78bfa` (violet) |

### Interações

| Ação | Resultado |
|---|---|
| Clicar no pin | Abre InfoWindow com detalhes |
| Clicar "Ver detalhes" | Navega para `/places/[id]` |
| Clicar "Rotas" | Abre Google Maps direção |
| Arrastar mapa | Atualiza visualização |
| Zoom | In/out no mapa |
| Filtro por categoria | Mostra/esconde pins |
| Buscar | Autocomplete + centraliza mapa |

---

## 9. Segurança

### API Key Restrictions

1. **HTTP referrers:** Apenas domínios autorizados
2. **APIs habilitadas:** Apenas as necessárias
3. **Quotas:** Definir limites por API
4. **Billing alerts:** $50, $100, $200

### Variável de Ambiente

```env
# CLIENT-SIDE (exposta no browser)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

# IMPORTANTE: A key é visível no client
# Restrição por domínio é OBRIGATÓRIA
```

---

## 10. Performance

### Otimizações

| Técnica | Onde |
|---|---|
| Lazy loading | Carregar mapa só quando visível |
| Marker clustering | Muitos pins (>50) |
| Debounce no search | Autocomplete |
| Cache de geocoding | 24h para endereços |
| Map ID | Custom styling via cloud |

### Lazy Loading

```typescript
// Dynamic import do mapa
const MapView = dynamic(
  () => import("./map-view/map-view.view").then((mod) => mod.MapView),
  { ssr: false, loading: () => <MapSkeleton /> }
);
```

---

## 11. Testes

### Testes de Componente

```typescript
// MapContainer.test.tsx
describe("MapContainer", () => {
  it("should render map with places", () => {
    render(
      <MapContainer
        center={{ lat: -23.55, lng: -46.63 }}
        zoom={13}
        places={mockPlaces}
        selectedCategory={null}
        onPlaceClick={jest.fn()}
      />
    );
    expect(screen.getByRole("application")).toBeTruthy();
  });
});
```

### Testes de Hook

```typescript
// useGeolocation.test.ts
describe("useGeolocation", () => {
  it("should return default center when geolocation denied", async () => {
    // Mock navigator.geolocation
    const { result } = renderHook(() => useGeolocation());
    await act(async () => {});
    expect(result.current.position).toEqual({ lat: -23.5505, lng: -46.6333 });
  });
});
```

---

## 12. Estimativa

| Dia | Tarefa |
|---|---|
| 1 | Setup Google Cloud + API key + MapProvider + useGeolocation |
| 2 | MapContainer + PlaceMarker + cores por categoria |
| 3 | PlaceInfoWindow + MapFilters |
| 4 | SearchBar (Autocomplete) + Directions + geocoding.ts |
| 5 | Integração nav + API geo-query + testes + polish |
| **Total** | **5 dias** |

---

## 13. Dependências

| Pacote | Versão | Uso |
|---|---|---|
| `@vis.gl/react-google-maps` | latest | Wrapper React oficial Google |
| `@googlemaps/markerclusterer` | latest | Clustering de pins |
| `@types/google.maps` | latest | Tipos TypeScript |

---

## 14. Checklist de Entrega

- [ ] API key configurada no Google Cloud
- [ ] Restrições de domínio aplicadas
- [ ] Alertas de billing configurados
- [ ] Mapa renderiza com pins coloridos
- [ ] Geolocalização funciona (ou fallback)
- [ ] Filtros por categoria funcionam
- [ ] Autocomplete busca lugares
- [ ] InfoWindow mostra detalhes
- [ ] Directions abre Google Maps
- [ ] Tab "Mapa" na navegação
- [ ] API suporta geo-query
- [ ] Lazy loading implementado
- [ ] Testes passando
- [ ] Zero `any` no código
