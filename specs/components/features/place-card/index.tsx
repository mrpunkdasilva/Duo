"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Check,
  UtensilsCrossed,
  Waves,
  Landmark,
  TreePine,
  Coffee,
  Wine,
  ShoppingBag,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Place, CATEGORY_LABELS, PlaceCategory } from "@/specs/types";
import { formatDate } from "@/lib/utils";

interface PlaceCardProps {
  place: Place;
  onToggleVisited?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const categoryIcons: Record<PlaceCategory, React.ElementType> = {
  restaurante: UtensilsCrossed,
  praia: Waves,
  museu: Landmark,
  parque: TreePine,
  cafeteria: Coffee,
  bar: Wine,
  loja: ShoppingBag,
  outro: MapPin,
};

export function PlaceCard({ place, onToggleVisited, onEdit, onDelete }: PlaceCardProps) {
  const CategoryIcon = categoryIcons[place.category] || MapPin;

  return (
    <Card className={`group transition-all ${place.visited ? "opacity-75" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <CategoryIcon className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg truncate">{place.name}</h3>
                {place.visited && (
                  <Badge variant="success" className="flex-shrink-0">
                    <Check className="h-3 w-3 mr-1" />
                    Visitado
                  </Badge>
                )}
              </div>

              {place.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {place.description}
                </p>
              )}

              {place.address && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3">
                <Badge variant="outline" className="text-xs">
                  {CATEGORY_LABELS[place.category]}
                </Badge>

                {place.rating && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < place.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <span className="text-xs text-muted-foreground">
                  {formatDate(place.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onToggleVisited && (
                <DropdownMenuItem onClick={() => onToggleVisited(place._id.toString())}>
                  <Check className="h-4 w-4 mr-2" />
                  {place.visited ? "Desmarcar" : "Marcar visitado"}
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(place._id.toString())}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(place._id.toString())}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
