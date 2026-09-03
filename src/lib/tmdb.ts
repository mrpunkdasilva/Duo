import { MediaItem } from "@/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is not defined in environment variables");
  }
  return key;
}

async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "pt-BR");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

interface TMDBSearchResponse {
  page: number;
  results: MediaItem[];
  total_results: number;
  total_pages: number;
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBSearchResponse> {
  return tmdbFetch("/search/movie", {
    query,
    page: page.toString(),
  });
}

export async function searchTVShows(
  query: string,
  page: number = 1
): Promise<TMDBSearchResponse> {
  return tmdbFetch("/search/tv", {
    query,
    page: page.toString(),
  });
}

export async function searchMulti(
  query: string,
  page: number = 1
): Promise<TMDBSearchResponse> {
  return tmdbFetch("/search/multi", {
    query,
    page: page.toString(),
  });
}

export async function getTrending(
  timeWindow: "day" | "week" = "week"
): Promise<TMDBSearchResponse> {
  return tmdbFetch(`/trending/all/${timeWindow}`);
}

export async function getPopularMovies(
  page: number = 1
): Promise<TMDBSearchResponse> {
  return tmdbFetch("/movie/popular", {
    page: page.toString(),
  });
}

export async function getPopularTVShows(
  page: number = 1
): Promise<TMDBSearchResponse> {
  return tmdbFetch("/tv/popular", {
    page: page.toString(),
  });
}

export async function getMovieDetail(id: number): Promise<MediaItem> {
  return tmdbFetch(`/movie/${id}`);
}

export async function getTVShowDetail(id: number): Promise<MediaItem> {
  return tmdbFetch(`/tv/${id}`);
}

export async function getMovieCredits(id: number) {
  return tmdbFetch(`/movie/${id}/credits`);
}

export async function getTVShowCredits(id: number) {
  return tmdbFetch(`/tv/${id}/credits`);
}

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w500" | "original" = "w500"
): string {
  if (!path) return "/placeholder-movie.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
