"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/features/stats-card";
import { PlaceList } from "@/components/features/place-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Place, DashboardStats } from "@/specs/types";
import { Plus, MapPin } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, placesRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/places?limit=5"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (placesRes.ok) {
          const placesData = await placesRes.json();
          setRecentPlaces(placesData.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleToggleVisited = async (id: string) => {
    try {
      const place = recentPlaces.find((p) => p._id.toString() === id);
      if (!place) return;

      const response = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visited: !place.visited }),
      });

      if (response.ok) {
        setRecentPlaces((prev) =>
          prev.map((p) =>
            p._id.toString() === id ? { ...p, visited: !p.visited } : p
          )
        );
        if (stats) {
          setStats({
            ...stats,
            visitedPlaces: place.visited
              ? stats.visitedPlaces - 1
              : stats.visitedPlaces + 1,
            pendingPlaces: place.visited
              ? stats.pendingPlaces + 1
              : stats.pendingPlaces - 1,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar lugar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Olá, {session?.user?.name?.split(" ")[0]}! Veja seus lugares.
            </p>
          </div>
          <Link href="/places/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lugar
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <StatsCard stats={stats} />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Últimos Lugares</CardTitle>
              <Link href="/places">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <MapPin className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                <PlaceList
                  places={recentPlaces}
                  onToggleVisited={handleToggleVisited}
                  emptyMessage="Nenhum lugar adicionado ainda"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
