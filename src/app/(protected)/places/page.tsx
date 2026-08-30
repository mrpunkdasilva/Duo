"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlaceCard } from "@/components/features/place-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Place, PlaceCategory, CATEGORY_LABELS } from "@/types";
import { Plus, Search, UtensilsCrossed, Waves, Landmark, TreePine, Coffee, Wine, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";

const categoryIconMap: Record<PlaceCategory, React.ElementType> = {
  restaurante: UtensilsCrossed,
  praia: Waves,
  museu: Landmark,
  parque: TreePine,
  cafeteria: Coffee,
  bar: Wine,
  loja: ShoppingBag,
  outro: MapPin,
};

export default function PlacesPage() {
  const t = useTranslations("places");
  const tc = useTranslations("common");
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const response = await fetch("/api/places");
        if (response.ok) {
          const data = await response.json();
          setPlaces(data.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar lugares:", error);
      }
    }

    loadPlaces();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPlaces = useMemo(() => {
    let result = places;

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === "visited") {
      result = result.filter((p) => p.visited);
    } else if (activeTab === "pending") {
      result = result.filter((p) => !p.visited);
    }

    return result;
  }, [places, searchQuery, activeTab]);

  const groupedPlaces = useMemo(() => {
    const groups: Partial<Record<PlaceCategory, Place[]>> = {};

    filteredPlaces.forEach((place) => {
      const category = place.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category]!.push(place);
    });

    return groups;
  }, [filteredPlaces]);

  const handleToggleVisited = async (id: string) => {
    try {
      const place = places.find((p) => p._id.toString() === id);
      if (!place) return;

      const response = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visited: !place.visited }),
      });

      if (response.ok) {
        setPlaces((prev) =>
          prev.map((p) =>
            p._id.toString() === id ? { ...p, visited: !p.visited } : p
          )
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar lugar:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/places/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      const response = await fetch("/api/places", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setPlaces((prev) => prev.filter((p) => p._id.toString() !== id));
      }
    } catch (error) {
      console.error("Erro ao excluir lugar:", error);
    }
  };

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedPlaces).sort() as PlaceCategory[];
  }, [groupedPlaces]);

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {places.length === 0
              ? t("emptyAll")
              : t("savedCount", { count: places.length })}
          </p>
        </div>
        <Link href="/places/new">
          <Button className="bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            {tc("newPlace")}
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-12 rounded-xl bg-muted/50"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-muted/50 rounded-xl h-11">
          <TabsTrigger value="all" className="flex-1 rounded-lg text-xs">
            {t("tabs.all")} ({places.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 rounded-lg text-xs">
            {t("tabs.pending")} ({places.filter((p) => !p.visited).length})
          </TabsTrigger>
          <TabsTrigger value="visited" className="flex-1 rounded-lg text-xs">
            {t("tabs.visited")} ({places.filter((p) => p.visited).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-6">
          {sortedCategories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("emptySearch")}</p>
          ) : (
            sortedCategories.map((category) => {
              const Icon = categoryIconMap[category];
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    <h2 className="font-semibold text-sm">{CATEGORY_LABELS[category]}</h2>
                    <span className="text-xs text-muted-foreground">({groupedPlaces[category]?.length})</span>
                  </div>
                  <div className="space-y-3">
                    {groupedPlaces[category]?.map((place) => (
                      <PlaceCard
                        key={place._id.toString()}
                        place={place}
                        onToggleVisited={handleToggleVisited}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-6">
          {sortedCategories.filter(cat => groupedPlaces[cat]?.some(p => !p.visited)).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("emptyPending")}</p>
          ) : (
            sortedCategories.filter(cat => groupedPlaces[cat]?.some(p => !p.visited)).map((category) => {
              const Icon = categoryIconMap[category];
              const pendingPlaces = groupedPlaces[category]?.filter(p => !p.visited) || [];
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    <h2 className="font-semibold text-sm">{CATEGORY_LABELS[category]}</h2>
                    <span className="text-xs text-muted-foreground">({pendingPlaces.length})</span>
                  </div>
                  <div className="space-y-3">
                    {pendingPlaces.map((place) => (
                      <PlaceCard
                        key={place._id.toString()}
                        place={place}
                        onToggleVisited={handleToggleVisited}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="visited" className="mt-4 space-y-6">
          {sortedCategories.filter(cat => groupedPlaces[cat]?.some(p => p.visited)).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("emptyVisited")}</p>
          ) : (
            sortedCategories.filter(cat => groupedPlaces[cat]?.some(p => p.visited)).map((category) => {
              const Icon = categoryIconMap[category];
              const visitedPlaces = groupedPlaces[category]?.filter(p => p.visited) || [];
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    <h2 className="font-semibold text-sm">{CATEGORY_LABELS[category]}</h2>
                    <span className="text-xs text-muted-foreground">({visitedPlaces.length})</span>
                  </div>
                  <div className="space-y-3">
                    {visitedPlaces.map((place) => (
                      <PlaceCard
                        key={place._id.toString()}
                        place={place}
                        onToggleVisited={handleToggleVisited}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
