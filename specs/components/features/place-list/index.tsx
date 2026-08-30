"use client";

import { PlaceCard } from "@/components/features/place-card";
import { Place } from "@/specs/types";
import { MapPin } from "lucide-react";

interface PlaceListProps {
  places: Place[];
  onToggleVisited?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export function PlaceList({
  places,
  onToggleVisited,
  onEdit,
  onDelete,
  emptyMessage = "Nenhum lugar encontrado",
}: PlaceListProps) {
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione lugares que vocês querem visitar juntos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {places.map((place) => (
        <PlaceCard
          key={place._id.toString()}
          place={place}
          onToggleVisited={onToggleVisited}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
