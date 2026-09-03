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
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <MovieCard
          key={`${item.id}-${index}`}
          item={item}
          onAddToList={onAddToList}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(item.id)}
        />
      ))}
    </div>
  );
}
