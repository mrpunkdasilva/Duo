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
