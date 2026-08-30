"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { PlaceList } from "@/components/features/place-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Place, PlaceCategory, CATEGORY_LABELS } from "@/specs/types";
import { Plus, Search, MapPin } from "lucide-react";
import Link from "next/link";

export default function PlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadPlaces();
  }, []);

  useEffect(() => {
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

    setFilteredPlaces(result);
  }, [places, searchQuery, activeTab]);

  const loadPlaces = async () => {
    try {
      const response = await fetch("/api/places");
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.data || []);
        setFilteredPlaces(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar lugares:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!confirm("Tem certeza que deseja excluir este lugar?")) return;

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lugares</h1>
            <p className="text-muted-foreground mt-1">
              {places.length} lugar(es) salvos
            </p>
          </div>
          <Link href="/places/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lugar
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar lugares..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                Todos ({places.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendentes ({places.filter((p) => !p.visited).length})
              </TabsTrigger>
              <TabsTrigger value="visited">
                Visitados ({places.filter((p) => p.visited).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <PlaceList
                places={filteredPlaces}
                onToggleVisited={handleToggleVisited}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage="Nenhum lugar encontrado"
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <PlaceList
                places={filteredPlaces}
                onToggleVisited={handleToggleVisited}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage="Nenhum lugar pendente"
              />
            </TabsContent>
            <TabsContent value="visited" className="mt-6">
              <PlaceList
                places={filteredPlaces}
                onToggleVisited={handleToggleVisited}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage="Nenhum lugar visitado ainda"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
