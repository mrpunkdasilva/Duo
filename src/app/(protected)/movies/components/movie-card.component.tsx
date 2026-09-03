"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Star, Film, Tv, Heart, Plus } from "lucide-react";
import { MediaItem, GENRE_MAP } from "@/types";
import { getImageUrl } from "../data/mock-movies";

interface MovieCardProps {
  item: MediaItem;
  onAddToList?: (item: MediaItem) => void;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

export function MovieCard({
  item,
  onAddToList,
  onToggleFavorite,
  isFavorite = false,
}: MovieCardProps) {
  const title = item.title || item.name || "Sem título";
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const genres = item.genre_ids
    .slice(0, 2)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  return (
    <Card className="border border-border/60 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-border/80 active:scale-[0.98]">
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] bg-muted">
          {item.poster_path ? (
            <img
              src={getImageUrl(item.poster_path, "w300")}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {item.media_type === "movie" ? (
                <Film className="h-12 w-12 text-muted-foreground/50" />
              ) : (
                <Tv className="h-12 w-12 text-muted-foreground/50" />
              )}
            </div>
          )}

          <div className="absolute top-2 left-2">
            <Badge className="bg-black/70 text-white border-0 text-[10px] px-2 py-0.5">
              {item.media_type === "movie" ? "Filme" : "Série"}
            </Badge>
          </div>

          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-medium">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <Heading as="h3" variant="card" className="text-white line-clamp-1">
              {title}
            </Heading>
            {year && (
              <p className="text-white/70 text-xs mt-0.5">{year}</p>
            )}
          </div>
        </div>

        <div className="p-3 space-y-2">
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.overview}
          </p>

          <div className="flex items-center gap-2 pt-1">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(item.id)}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  }`}
                />
              </button>
            )}

            {onAddToList && (
              <button
                onClick={() => onAddToList(item)}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                aria-label="Adicionar à lista"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
