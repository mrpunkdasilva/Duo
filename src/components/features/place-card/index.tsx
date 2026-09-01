"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import {
  MapPin,
  Star,
  CheckCircle2,
  UtensilsCrossed,
  Waves,
  Landmark,
  TreePine,
  Coffee,
  Wine,
  ShoppingBag,
  Pencil,
  Trash2,
  Bookmark,
} from "lucide-react";
import { Place, CATEGORY_LABELS } from "@/types";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

interface PlaceCardProps {
  place: Place;
  onToggleVisited?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  restaurante: UtensilsCrossed,
  praia: Waves,
  museu: Landmark,
  parque: TreePine,
  cafeteria: Coffee,
  bar: Wine,
  loja: ShoppingBag,
};

const categoryColors: Record<string, string[]> = {
  restaurante: ["#fb923c", "#f87171"],
  praia: ["#60a5fa", "#22d3ee"],
  museu: ["#a78bfa", "#818cf8"],
  parque: ["#4ade80", "#34d399"],
  cafeteria: ["#fbbf24", "#facc15"],
  bar: ["#f472b6", "#fb7185"],
  loja: ["#a78bfa", "#c084fc"],
};

export function PlaceCard({ place, onToggleVisited, onEdit, onDelete }: PlaceCardProps) {
  const t = useTranslations("placeCard");
  const CategoryIcon = categoryIcons[place.category] || MapPin;
  const colors = categoryColors[place.category] || ["#f43f5e", "#14b8a6"];

  return (
    <Link href={`/places/${place._id}`} className="block">
      <Card
        className={`border border-border/60 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-border/80 active:scale-[0.98] ${
          place.visited ? "opacity-70" : ""
        }`}
      >
        <CardContent className="p-0">
          <div
            className="h-1.5"
            style={{ background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})` }}
          />

          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})` }}
              >
                <CategoryIcon className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Heading as="h3" variant="card" className="truncate">{place.name}</Heading>
                  {place.visited && (
                    <Badge className="bg-duo-teal/10 text-duo-teal border-0 text-[10px] px-1.5 py-0 flex-shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                      {t("visited")}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {CATEGORY_LABELS[place.category] || place.category}
                </p>
              </div>

              {onToggleVisited && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleVisited(place._id.toString());
                  }}
                  className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
                >
                  <Bookmark
                    className={`h-5 w-5 transition-colors ${
                      place.visited ? "fill-duo-rose text-duo-rose" : "text-muted-foreground"
                    }`}
                  />
                </button>
              )}
            </div>

            {place.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {place.description}
              </p>
            )}

            {place.address && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{place.address}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                {place.rating ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => {
                        const values = Object.values(place.rating!).filter(Boolean);
                        const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                        return (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(place.createdAt)}</span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">{formatDate(place.createdAt)}</span>
                )}
              </div>

              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(place._id.toString());
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(place._id.toString());
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
