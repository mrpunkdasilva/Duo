"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { Search, Film, Tv, Heart } from "lucide-react";
import { MediaItem } from "@/types";
import { MOCK_MOVIES, MOCK_TV_SHOWS } from "../data/mock-movies";
import { MovieGrid } from "../components/movie-grid.component";

export function MoviesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredMovies = useMemo(() => {
    if (!searchQuery) return MOCK_MOVIES;
    return MOCK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.overview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredSeries = useMemo(() => {
    if (!searchQuery) return MOCK_TV_SHOWS;
    return MOCK_TV_SHOWS.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.overview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const allItems = useMemo(
    () => [...filteredMovies, ...filteredSeries],
    [filteredMovies, filteredSeries]
  );

  const favoriteItems = useMemo(
    () => allItems.filter((item) => favorites.includes(item.id)),
    [allItems, favorites]
  );

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
      <div>
        <Heading as="h1" variant="page">
          Filmes e Séries
        </Heading>
        <p className="text-sm text-muted-foreground mt-1">
          Descubra e salve seus filmes e séries favoritos
        </p>
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
      </Tabs>
    </div>
  );
}
