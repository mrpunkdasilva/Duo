"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlaceList } from "@/components/features/place-list";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Place } from "@/types";
import { Search } from "lucide-react";

export default function PlacesPage() {
  const t = useTranslations("places");
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
    router.push(`/places/${id}`);
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

  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {places.length === 0
            ? t("emptyAll")
            : t("savedCount", { count: places.length })}
        </p>
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

        <TabsContent value="all" className="mt-4">
          <PlaceList
            places={filteredPlaces}
            onToggleVisited={handleToggleVisited}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={t("emptySearch")}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <PlaceList
            places={filteredPlaces}
            onToggleVisited={handleToggleVisited}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={t("emptyPending")}
          />
        </TabsContent>
        <TabsContent value="visited" className="mt-4">
          <PlaceList
            places={filteredPlaces}
            onToggleVisited={handleToggleVisited}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={t("emptyVisited")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
