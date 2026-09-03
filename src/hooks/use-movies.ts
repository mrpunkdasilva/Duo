"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types";

interface UseMoviesOptions {
  query?: string;
  type?: "movie" | "tv" | "multi";
  trending?: "day" | "week";
  enabled?: boolean;
}

interface UseMoviesReturn {
  movies: MediaItem[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
}

export function useMovies({
  query,
  type = "multi",
  trending,
  enabled = true,
}: UseMoviesOptions = {}): UseMoviesReturn {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMovies = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.set("q", query);
        searchParams.set("type", type);
      }

      if (trending) {
        searchParams.set("trending", trending);
      }

      const response = await fetch(`/api/movies?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [query, type, trending, enabled]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    isLoading,
    error,
    total,
    refetch: fetchMovies,
  };
}
