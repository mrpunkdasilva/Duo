"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Plus, Filter, Heart, Film, Eye, CheckCircle, Clock, ListPlus } from "lucide-react";
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

type StatusFilter = "all" | "favorites" | "not_watched" | "watching" | "watched" | "to_watch";

const STATUS_OPTIONS = [
  { value: "all", label: "Todos", icon: Film },
  { value: "favorites", label: "Favoritos", icon: Heart },
  { value: "not_watched", label: "Não Visto", icon: Eye },
  { value: "watching", label: "Assistindo", icon: Clock },
  { value: "watched", label: "Visto", icon: CheckCircle },
  { value: "to_watch", label: "Ver Depois", icon: ListPlus },
];

export function MoviesView() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

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

  const favorites = useMemo(() => {
    if (!currentUserId) return [];
    return movies
      .filter((m) => m.favoritedBy && m.favoritedBy.includes(currentUserId))
      .map((m) => m._id as string);
  }, [movies, currentUserId]);

  const getUserWatchStatus = (movie: MediaItem): string => {
    if (!currentUserId) return "not_watched";
    const status = movie.watchStatuses?.find((ws) => ws.userId === currentUserId);
    return status?.status || "not_watched";
  };

  const filteredMovies = movies.filter((movie) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      (movie.title || "").toLowerCase().includes(query) ||
      (movie.name || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

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

    if (statusFilter !== "all") {
      if (statusFilter === "favorites") {
        if (!favorites.includes(movie._id as string)) return false;
      } else {
        if (getUserWatchStatus(movie) !== statusFilter) return false;
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

  const handleToggleFavorite = async (item: MediaItem) => {
    const movieId = item._id as string;
    const isFav = favorites.includes(movieId);

    try {
      const response = await fetch("/api/movies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movieId,
          favorite: !isFav,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar favorito");
      }

      setMovies((prev) =>
        prev.map((m) =>
          m._id === movieId
            ? {
                ...m,
                favoritedBy: isFav
                  ? (m.favoritedBy || []).filter((id) => id !== currentUserId)
                  : [...(m.favoritedBy || []), currentUserId!],
              }
            : m
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
    }
  };

  const activeFilterCount =
    filters.mediaType.length + filters.genres.length;

  const getStatusCounts = () => {
    const base = movies.filter((movie) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query ||
        (movie.title || "").toLowerCase().includes(query) ||
        (movie.name || "").toLowerCase().includes(query);
      return matchesSearch;
    });

    return {
      all: base.length,
      favorites: base.filter((m) => favorites.includes(m._id as string)).length,
      not_watched: base.filter((m) => getUserWatchStatus(m) === "not_watched").length,
      watching: base.filter((m) => getUserWatchStatus(m) === "watching").length,
      watched: base.filter((m) => getUserWatchStatus(m) === "watched").length,
      to_watch: base.filter((m) => getUserWatchStatus(m) === "to_watch").length,
    };
  };

  const counts = getStatusCounts();

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

      <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <SelectTrigger className="h-11 rounded-xl bg-muted/50">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
                <span className="text-muted-foreground text-xs">({counts[option.value as StatusFilter]})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : sortedMovies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
            <Film className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {statusFilter === "all" ? "Nenhum filme encontrado" : "Nenhum filme nesta categoria"}
          </p>
        </div>
      ) : (
        <MovieGrid
          items={sortedMovies}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
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
