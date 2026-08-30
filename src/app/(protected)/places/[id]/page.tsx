"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Place, CATEGORY_LABELS } from "@/types";
import {
  ArrowLeft,
  MapPin,
  Star,
  Pencil,
  CheckCircle2,
  Loader2,
  UtensilsCrossed,
  Waves,
  Landmark,
  TreePine,
  Coffee,
  Wine,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/helpers";

const categoryIcons: Record<string, React.ElementType> = {
  restaurante: UtensilsCrossed,
  praia: Waves,
  museu: Landmark,
  parque: TreePine,
  cafeteria: Coffee,
  bar: Wine,
  loja: ShoppingBag,
  outro: MapPin,
};

const categoryColors: Record<string, string> = {
  restaurante: "from-orange-400 to-red-400",
  praia: "from-blue-400 to-cyan-400",
  museu: "from-purple-400 to-indigo-400",
  parque: "from-green-400 to-emerald-400",
  cafeteria: "from-amber-400 to-yellow-400",
  bar: "from-pink-400 to-rose-400",
  loja: "from-violet-400 to-purple-400",
  outro: "from-duo-rose to-duo-teal",
};

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("placeDetail");
  const tc = useTranslations("common");
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlace() {
      try {
        const response = await fetch(`/api/places?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setPlace(data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar lugar:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  const handleToggleVisited = async () => {
    if (!place) return;

    try {
      const response = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visited: !place.visited }),
      });

      if (response.ok) {
        setPlace((prev) => prev ? { ...prev, visited: !prev.visited } : prev);
      }
    } catch (error) {
      console.error("Erro ao atualizar lugar:", error);
    }
  };

  const CategoryIcon = place ? (categoryIcons[place.category] || MapPin) : MapPin;
  const colorGradient = place ? (categoryColors[place.category] || "from-duo-rose to-duo-teal") : "from-duo-rose to-duo-teal";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="px-4 pt-4">
        <div className="text-center py-16">
          <p className="text-muted-foreground">{tc("notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/places">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {tc("back")}
          </Button>
        </Link>
        <Link href={`/places/${id}/edit`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil className="h-3.5 w-3.5" />
            {tc("edit")}
          </Button>
        </Link>
      </div>

      <div className={`h-2 rounded-full bg-gradient-to-r ${colorGradient}`} />

      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-sm`}>
          <CategoryIcon className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{place.name}</h1>
            {place.visited && (
              <Badge className="bg-duo-teal/10 text-duo-teal border-0 text-xs px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {t("visited")}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {CATEGORY_LABELS[place.category]}
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-muted/30">
        <CardContent className="p-4 space-y-4">
          {place.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("description")}</h3>
              <p className="text-sm">{place.description}</p>
            </div>
          )}

          {place.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("address")}</h3>
                <p className="text-sm">{place.address}</p>
              </div>
            </div>
          )}

          {place.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("notes")}</h3>
              <p className="text-sm">{place.notes}</p>
            </div>
          )}

          {place.rating && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("rating")}</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < place.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("addedIn")}</h3>
            <p className="text-sm">{formatDate(place.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleToggleVisited}
        variant="outline"
        className={`w-full h-12 rounded-xl ${
          place.visited
            ? "border-duo-teal/30 text-duo-teal hover:bg-duo-teal/5"
            : "border-duo-rose/30 text-duo-rose hover:bg-duo-rose/5"
        }`}
      >
        <BookmarkIcon className="h-4 w-4 mr-2" filled={place.visited} />
        {place.visited ? t("markAsPending") : t("markAsVisited")}
      </Button>
    </div>
  );
}

function BookmarkIcon({ className, filled }: { className?: string; filled: boolean }) {
  if (filled) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
