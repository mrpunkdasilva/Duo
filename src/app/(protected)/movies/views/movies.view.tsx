"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { Search, Film, Tv, Heart, Loader2, Plus } from "lucide-react";
import { MediaItem } from "@/types";
import { MovieGrid } from "../components/movie-grid.component";

export function MoviesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (query?: string, type?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.set("q", query);
        searchParams.set("type", type || "multi");
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
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        fetchMovies(searchQuery, activeTab === "movies" ? "movie" : activeTab === "series" ? "tv" : "multi");
      } else {
        fetchMovies();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab, fetchMovies]);

  const filteredMovies = movies.filter((m) => m.media_type === "movie");
  const filteredSeries = movies.filter((m) => m.media_type === "tv");

  const allItems = movies;

  const favoriteItems = movies.filter((item) => favorites.includes(item.id));

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const handleAddToList = (item: MediaItem) => {
    console.log("Adicionar à lista:", item);
  };

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h1" variant="page">
            Filmes e Séries
          </Heading>
          <p className="text-sm text-muted-foreground mt-1">
            Descubra e salve seus filmes e séries favoritos
          </p>
        </div>
        <Link href="/movies/new">
          <Button className="bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar filmes ou séries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-12 rounded-xl bg-muted/50"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-muted/50 rounded-xl h-11">
          <TabsTrigger value="all" className="flex-1 rounded-lg text-xs">
            Todos ({allItems.length})
          </TabsTrigger>
          <TabsTrigger value="movies" className="flex-1 rounded-lg text-xs">
            <Film className="h-3.5 w-3.5 mr-1" />
            Filmes ({filteredMovies.length})
          </TabsTrigger>
          <TabsTrigger value="series" className="flex-1 rounded-lg text-xs">
            <Tv className="h-3.5 w-3.5 mr-1" />
            Séries ({filteredSeries.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex-1 rounded-lg text-xs">
            <Heart className="h-3.5 w-3.5 mr-1" />
            ({favoriteItems.length})
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
                items={allItems}
                onAddToList={handleAddToList}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </TabsContent>

            <TabsContent value="movies" className="mt-4">
              <MovieGrid
                items={filteredMovies}
                onAddToList={handleAddToList}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </TabsContent>

            <TabsContent value="series" className="mt-4">
              <MovieGrid
                items={filteredSeries}
                onAddToList={handleAddToList}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              <MovieGrid
                items={favoriteItems}
                onAddToList={handleAddToList}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
