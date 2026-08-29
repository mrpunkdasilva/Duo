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
  MoreHorizontal,
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

const categoryColors: Record<PlaceCategory, string> = {
  restaurante: "from-orange-400 to-red-400",
  praia: "from-blue-400 to-cyan-400",
  museu: "from-purple-400 to-indigo-400",
  parque: "from-green-400 to-emerald-400",
  cafeteria: "from-amber-400 to-yellow-400",
  bar: "from-pink-400 to-rose-400",
  loja: "from-violet-400 to-purple-400",
  outro: "from-duo-rose to-duo-teal",
};

export function PlaceCard({ place, onToggleVisited, onEdit, onDelete }: PlaceCardProps) {
  const t = useTranslations("placeCard");
  const tc = useTranslations("common");
  const [showActions, setShowActions] = useState(false);
  const CategoryIcon = categoryIcons[place.category] || MapPin;
  const colorGradient = categoryColors[place.category] || "from-duo-rose to-duo-teal";

  return (
    <Card
      className={`group overflow-hidden rounded-2xl border-0 shadow-sm transition-all ${
        place.visited ? "opacity-80" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className={`relative h-2 bg-gradient-to-r ${colorGradient}`} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-sm`}>
              <CategoryIcon className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{place.name}</h3>
                {place.visited && (
                  <Badge className="bg-duo-teal/10 text-duo-teal border-0 text-[10px] px-1.5 py-0">
                    <Check className="h-2.5 w-2.5 mr-0.5" />
                    {t("visited")}
                  </Badge>
                )}
              </div>

              {place.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {place.description}
                </p>
              )}

              {place.address && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[10px] rounded-lg border-border/50">
                  {CATEGORY_LABELS[place.category]}
                </Badge>

                {place.rating && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < place.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-muted-foreground ml-auto">
                  {formatDate(place.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onToggleVisited && (
                <button
                  onClick={() => onToggleVisited(place._id.toString())}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      place.visited
                        ? "fill-duo-rose text-duo-rose"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              )}
              <button
                onClick={() => setShowActions(!showActions)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(place._id.toString());
                    setShowActions(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  {tc("edit")}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(place._id.toString());
                    setShowActions(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  {tc("delete")}
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
