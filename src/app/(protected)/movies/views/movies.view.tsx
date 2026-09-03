"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Search, Loader2, Plus, Filter } from "lucide-react";
import { MediaItem } from "@/types";
import { MovieGrid } from "../components/movie-grid.component";
import { MovieFilterDialog } from "../components/movie-filter-dialog.component";

interface Filters {
  mediaType: string[];
  genres: number[];
  yearRange: string;
  sortBy: string;
}

const defaultFilters: Filters = {
  mediaType: [],
  genres: [],
  yearRange: "",
  sortBy: "recent",
};

export function MoviesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const fetchMovies = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.set("q", query);
      }

      if (filters.mediaType.length === 1) {
        searchParams.set("type", filters.mediaType[0]);
      }

      const response = await fetch(`/api/movies?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters.mediaType]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        fetchMovies(searchQuery);
      } else {
        fetchMovies();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, fetchMovies]);

  const filteredMovies = movies.filter((movie) => {
    if (filters.mediaType.length > 0) {
      if (!filters.mediaType.includes(movie.media_type)) {
        return false;
      }
    }

    if (filters.genres.length > 0) {
      const movieGenres = movie.genre_ids || [];
      if (!filters.genres.some((g) => movieGenres.includes(g))) {
        return false;
      }
    }

    return true;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (filters.sortBy) {
      case "rating":
        return (b.vote_average || 0) - (a.vote_average || 0);
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "year":
        const yearA = a.release_date || a.first_air_date || "";
        const yearB = b.release_date || b.first_air_date || "";
        return yearB.localeCompare(yearA);
      default:
        return 0;
    }
  });

  const handleToggleFavorite = (id: number) => {
    console.log("Toggle favorite:", id);
  };

  const activeFilterCount =
    filters.mediaType.length + filters.genres.length;

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="space-y-3">
        <Heading as="h1" variant="page">
          Filmes e Séries
        </Heading>
        <p className="text-sm text-muted-foreground">
          Descubra e salve seus filmes e séries favoritos
        </p>
        <Link href="/movies/new">
          <Button className="bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar filmes ou séries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-12 rounded-xl bg-muted/50"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="h-12 px-4 rounded-xl relative"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-duo-rose text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <MovieGrid
          items={sortedMovies}
          onToggleFavorite={handleToggleFavorite}
          favorites={[]}
        />
      )}

      <MovieFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
}
