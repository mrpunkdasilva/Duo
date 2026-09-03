"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";
import { GENRES } from "@/types";

interface MovieFilters {
  mediaType: string[];
  genres: number[];
  yearRange: string;
  sortBy: string;
}

interface MovieFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: MovieFilters;
  onApplyFilters: (filters: MovieFilters) => void;
}

export function MovieFilterDialog({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: MovieFilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<MovieFilters>(filters);

  const handleMediaTypeToggle = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      mediaType: prev.mediaType.includes(type)
        ? prev.mediaType.filter((t) => t !== type)
        : [...prev.mediaType, type],
    }));
  };

  const handleGenreToggle = (genreId: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((g) => g !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const handleClearAll = () => {
    setLocalFilters({
      mediaType: [],
      genres: [],
      yearRange: "",
      sortBy: "recent",
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const activeFilterCount =
    localFilters.mediaType.length + localFilters.genres.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-duo-rose" />
              Filtros
            </DialogTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
          <DialogDescription>
            Filtre por tipo, gênero e ordenação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo</Label>
            <div className="flex gap-2">
              {[
                { value: "movie", label: "Filmes" },
                { value: "tv", label: "Séries" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleMediaTypeToggle(type.value)}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                    localFilters.mediaType.includes(type.value)
                      ? "bg-gradient-to-r from-duo-rose to-duo-teal text-white"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Gêneros</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`flex items-center h-9 px-3 rounded-lg text-xs font-medium transition-all ${
                    localFilters.genres.includes(genre.id)
                      ? "bg-duo-rose/10 text-duo-rose border border-duo-rose/30"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Ordenar por</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "recent", label: "Mais recente" },
                { value: "rating", label: "Melhor avaliados" },
                { value: "title", label: "Título A-Z" },
                { value: "year", label: "Ano" },
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, sortBy: sort.value }))
                  }
                  className={`h-9 rounded-lg text-xs font-medium transition-all ${
                    localFilters.sortBy === sort.value
                      ? "bg-duo-rose/10 text-duo-rose border border-duo-rose/30"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApply}
            className="rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
          >
            Aplicar
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
