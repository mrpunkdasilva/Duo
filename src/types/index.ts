import { ObjectId } from "mongodb";

export type PlaceCategory =
  | "restaurante"
  | "praia"
  | "museu"
  | "parque"
  | "cafeteria"
  | "bar"
  | "loja"
  | string;

export const PLACE_CATEGORIES: PlaceCategory[] = [
  "restaurante",
  "praia",
  "museu",
  "parque",
  "cafeteria",
  "bar",
  "loja",
];

export const CATEGORY_LABELS: Record<string, string> = {
  restaurante: "Restaurante",
  praia: "Praia",
  museu: "Museu",
  parque: "Parque",
  cafeteria: "Cafeteria",
  bar: "Bar",
  loja: "Loja",
};

export const CATEGORY_ICONS: Record<string, string> = {
  restaurante: "UtensilsCrossed",
  praia: "Waves",
  museu: "Landmark",
  parque: "TreePine",
  cafeteria: "Coffee",
  bar: "Wine",
  loja: "ShoppingBag",
};

export interface User {
  _id: ObjectId | string;
  name: string;
  email: string;
  image?: string;
  coupleId?: ObjectId | string;
  createdAt: Date;
}

export interface Couple {
  _id: ObjectId | string;
  inviteCode: string;
  users: (ObjectId | string)[];
  createdAt: Date;
}

export interface PlaceRating {
  ambiente?: number;
  romance?: number;
  custo?: number;
  experiencia?: number;
}

export const RATING_CATEGORIES: (keyof PlaceRating)[] = [
  "ambiente",
  "romance",
  "custo",
  "experiencia",
];

export const RATING_LABELS: Record<keyof PlaceRating, string> = {
  ambiente: "Ambiente",
  romance: "Romance",
  custo: "Custo-Benefício",
  experiencia: "Experiência",
};

export interface Place {
  _id: ObjectId | string;
  coupleId: ObjectId | string;
  name: string;
  description?: string;
  category: PlaceCategory;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  visited: boolean;
  rating?: PlaceRating;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlaceInput {
  name: string;
  description?: string;
  category?: PlaceCategory;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  notes?: string;
}

export interface UpdatePlaceInput {
  name?: string;
  description?: string;
  category?: PlaceCategory;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  visited?: boolean;
  rating?: number;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalPlaces: number;
  visitedPlaces: number;
  pendingPlaces: number;
  categoryBreakdown: Record<PlaceCategory, number>;
  recentPlaces: Place[];
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  coupleId?: string | null;
}

export interface Category {
  _id: ObjectId | string;
  coupleId: ObjectId | string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  image?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface Comment {
  _id: ObjectId | string;
  placeId: ObjectId | string;
  userId: {
    _id: ObjectId | string;
    name: string;
    image?: string;
  };
  coupleId: ObjectId | string;
  text: string;
  createdAt: Date;
}

export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  _id?: string;
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type: MediaType;
  popularity: number;
  addedBy?: string;
  favoritedBy?: string[];
  coupleRating?: {
    romancio?: number;
    diversao?: number;
    emocao?: number;
    recomendaria?: number;
  };
  watchStatuses?: {
    userId: string;
    status: "not_watched" | "watching" | "watched" | "to_watch";
  }[];
  tagline?: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  genres?: Genre[];
  production_companies?: { id: number; name: string }[];
}

export const GENRES: Genre[] = [
  { id: 28, name: "Ação" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animação" },
  { id: 35, name: "Comédia" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentário" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Família" },
  { id: 14, name: "Fantasia" },
  { id: 36, name: "História" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Mistério" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ficção Científica" },
  { id: 53, name: "Suspense" },
  { id: 10752, name: "Guerra" },
  { id: 37, name: "Faroeste" },
];

export const GENRE_MAP: Record<number, string> = Object.fromEntries(
  GENRES.map((g) => [g.id, g.name])
);
