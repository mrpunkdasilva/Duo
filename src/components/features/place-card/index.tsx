"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Pencil,
  Trash2,
  Heart,
} from "lucide-react";
import { Place, CATEGORY_LABELS, PlaceCategory } from "@/types";
import { formatDate } from "@/lib/helpers";

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

const categoryBg: Record<PlaceCategory, string> = {
  restaurante: "bg-orange-50 text-orange-600",
  praia: "bg-blue-50 text-blue-600",
  museu: "bg-purple-50 text-purple-600",
  parque: "bg-green-50 text-green-600",
  cafeteria: "bg-amber-50 text-amber-600",
  bar: "bg-pink-50 text-pink-600",
  loja: "bg-violet-50 text-violet-600",
  outro: "bg-duo-rose/10 text-duo-rose",
};

export function PlaceCard({ place, onToggleVisited, onEdit, onDelete }: PlaceCardProps) {
  const t = useTranslations("placeCard");
  const tc = useTranslations("common");
  const [showActions, setShowActions] = useState(false);
  const CategoryIcon = categoryIcons[place.category] || MapPin;
  const bgColor = categoryBg[place.category] || "bg-duo-rose/10 text-duo-rose";

  return (
    <Card
      className={`border border-border/60 rounded-2xl shadow-sm transition-all ${
        place.visited ? "opacity-70" : ""
      }`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: icon + name + heart */}
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base truncate">{place.name}</h3>
              {place.visited && (
                <Badge className="bg-duo-teal/10 text-duo-teal border-0 text-[10px] px-1.5 py-0 flex-shrink-0">
                  <Check className="h-2.5 w-2.5 mr-0.5" />
                  {t("visited")}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {CATEGORY_LABELS[place.category]}
            </p>
          </div>
          {onToggleVisited && (
            <button
              onClick={() => onToggleVisited(place._id.toString())}
              className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  place.visited ? "fill-duo-rose text-duo-rose" : "text-muted-foreground"
                }`}
              />
            </button>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {place.description}
          </p>
        )}

        {/* Address */}
        {place.address && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{place.address}</span>
          </div>
        )}

        {/* Footer: rating + date + actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {place.rating ? (
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < place.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">{formatDate(place.createdAt)}</span>
            )}
            {place.rating && (
              <span className="text-xs text-muted-foreground">{formatDate(place.createdAt)}</span>
            )}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(place._id.toString())}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(place._id.toString())}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
