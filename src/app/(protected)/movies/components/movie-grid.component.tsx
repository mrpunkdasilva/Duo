"use client";

import { MediaItem } from "@/types";
import { MovieCard } from "./movie-card.component";

interface MovieGridProps {
  items: MediaItem[];
  onAddToList?: (item: MediaItem) => void;
  onToggleFavorite?: (id: number) => void;
  favorites?: number[];
}

export function MovieGrid({
  items,
  onAddToList,
  onToggleFavorite,
  favorites = [],
}: MovieGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <MovieCard
          key={item.id}
          item={item}
          onAddToList={onAddToList}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(item.id)}
        />
      ))}
    </div>
  );
}
