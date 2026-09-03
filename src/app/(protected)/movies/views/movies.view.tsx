"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
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

type TabValue = "all" | "favorites" | "not_watched" | "watching" | "watched" | "to_watch";

export function MoviesView() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [activeTab, setActiveTab] = useState<TabValue>("all");

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

  const favoriteMovies = sortedMovies.filter((m) => favorites.includes(m._id as string));
  const notWatchedMovies = sortedMovies.filter((m) => getUserWatchStatus(m) === "not_watched");
  const watchingMovies = sortedMovies.filter((m) => getUserWatchStatus(m) === "watching");
  const watchedMovies = sortedMovies.filter((m) => getUserWatchStatus(m) === "watched");
  const toWatchMovies = sortedMovies.filter((m) => getUserWatchStatus(m) === "to_watch");

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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="w-full bg-muted/50 rounded-xl h-11 overflow-x-auto flex">
          <TabsTrigger value="all" className="rounded-lg text-xs flex-shrink-0">
            Todos ({sortedMovies.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-lg text-xs flex-shrink-0">
            <Heart className="h-3.5 w-3.5 mr-1" />
            Fav ({favoriteMovies.length})
          </TabsTrigger>
          <TabsTrigger value="not_watched" className="rounded-lg text-xs flex-shrink-0">
            Não Visto ({notWatchedMovies.length})
          </TabsTrigger>
          <TabsTrigger value="watching" className="rounded-lg text-xs flex-shrink-0">
            Assistindo ({watchingMovies.length})
          </TabsTrigger>
          <TabsTrigger value="watched" className="rounded-lg text-xs flex-shrink-0">
            Visto ({watchedMovies.length})
          </TabsTrigger>
          <TabsTrigger value="to_watch" className="rounded-lg text-xs flex-shrink-0">
            Ver Depois ({toWatchMovies.length})
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-4">
              <MovieGrid
                items={sortedMovies}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              {favoriteMovies.length === 0 ? (
                <EmptyState icon={Heart} label="Nenhum favorito ainda" />
              ) : (
                <MovieGrid
                  items={favoriteMovies}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )}
            </TabsContent>

            <TabsContent value="not_watched" className="mt-4">
              {notWatchedMovies.length === 0 ? (
                <EmptyState icon={Eye} label="Nenhum filme não assistido" />
              ) : (
                <MovieGrid
                  items={notWatchedMovies}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )}
            </TabsContent>

            <TabsContent value="watching" className="mt-4">
              {watchingMovies.length === 0 ? (
                <EmptyState icon={Clock} label="Nenhum filme assistindo" />
              ) : (
                <MovieGrid
                  items={watchingMovies}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )}
            </TabsContent>

            <TabsContent value="watched" className="mt-4">
              {watchedMovies.length === 0 ? (
                <EmptyState icon={CheckCircle} label="Nenhum filme assistido" />
              ) : (
                <MovieGrid
                  items={watchedMovies}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )}
            </TabsContent>

            <TabsContent value="to_watch" className="mt-4">
              {toWatchMovies.length === 0 ? (
                <EmptyState icon={ListPlus} label="Nenhum filme para assistir" />
              ) : (
                <MovieGrid
                  items={toWatchMovies}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      <MovieFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: typeof Eye; label: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
