"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Loader2, Film, Tv, Star, Plus, Check } from "lucide-react";
import { MediaItem, GENRE_MAP } from "@/types";
import { getImageUrl } from "@/lib/tmdb";

interface MovieSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMovie: (item: MediaItem) => Promise<void>;
}

export function MovieSearchDialog({
  open,
  onOpenChange,
  onAddMovie,
}: MovieSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tmdb/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar filmes");
      }

      const data = await response.json();
      setResults(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar filmes");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleAdd = async (item: MediaItem) => {
    setAddingId(item.id);

    try {
      await onAddMovie(item);
      setAddedIds((prev) => [...prev, item.id]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar filme");
    } finally {
      setAddingId(null);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setResults([]);
    setError(null);
    setAddedIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Adicionar Filme/Série</DialogTitle>
          <DialogDescription>
            Busque e adicione filmes à sua lista
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar filme ou série..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 h-11 rounded-xl bg-muted/50"
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="w-full h-11 bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Buscar
          </Button>
        </div>

        {error && (
          <div className="mx-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {results.length > 0 ? (
            <div className="space-y-3 mt-3">
              {results.map((item) => {
                const isAdded = addedIds.includes(item.id);
                const isAdding = addingId === item.id;
                const title = item.title || item.name || "Sem título";
                const genres = (item.genre_ids || [])
                  .slice(0, 2)
                  .map((id) => GENRE_MAP[id])
                  .filter(Boolean);

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-muted">
                      {item.poster_path ? (
                        <img
                          src={getImageUrl(item.poster_path, "w200")}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {item.media_type === "movie" ? (
                            <Film className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Tv className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm line-clamp-1">
                              {title}
                            </h3>
                            <Badge variant="secondary" className="text-[9px] flex-shrink-0">
                              {item.media_type === "movie" ? "Filme" : "Série"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {item.release_date || item.first_air_date
                                ? new Date(
                                    item.release_date || item.first_air_date || ""
                                  ).getFullYear()
                                : "N/A"}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">
                                {item.vote_average?.toFixed(1) || "0.0"}
                              </span>
                            </div>
                          </div>
                          {genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {genres.map((genre) => (
                                <Badge
                                  key={genre}
                                  variant="outline"
                                  className="text-[9px] px-1 py-0"
                                >
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleAdd(item)}
                          disabled={isAdded || isAdding}
                          className={`flex-shrink-0 h-8 ${
                            isAdded
                              ? "bg-duo-teal text-white"
                              : "bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
                          }`}
                        >
                          {isAdding ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : isAdded ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {item.overview}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                <Film className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Nenhum resultado encontrado"
                  : "Busque por um filme ou série"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
