"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { PlaceList } from "@/components/features/place-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Place, DashboardStats } from "@/types";
import { Plus, Heart, Sparkles, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PartnerInfo {
  name: string;
  image?: string;
}

export default function HomePage() {
  const t = useTranslations("dashboard");
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partner, setPartner] = useState<PartnerInfo | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, placesRes, coupleRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/places?limit=5"),
          fetch("/api/couple"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (placesRes.ok) {
          const placesData = await placesRes.json();
          setRecentPlaces(placesData.data || []);
        }

        if (coupleRes.ok) {
          const coupleData = await coupleRes.json();
          if (coupleData.data?.partner) {
            setPartner(coupleData.data.partner);
          }
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

  const userName = session?.user?.name?.split(" ")[0] || "você";
  const partnerName = partner?.name?.split(" ")[0];
  const hasPartner = !!partner;

  return (
    <div className="px-4 pt-4 space-y-6">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-duo-rose/10 via-background to-duo-teal/10 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 fill-duo-rose text-duo-rose" />
            <span className="text-sm font-medium text-duo-rose">{t("forYouTwo")}</span>
          </div>

          {hasPartner ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {userName} & {partnerName}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center -space-x-2">
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-duo-rose/20 text-duo-rose text-xs font-bold">
                      {userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={partner.image || ""} />
                    <AvatarFallback className="bg-duo-teal/20 text-duo-teal text-xs font-bold">
                      {partnerName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-muted-foreground text-sm">
                  {recentPlaces.length === 0
                    ? t("emptyState")
                    : t("placesToExplore", { count: recentPlaces.length })}
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {t("greeting", { name: userName })}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("emptyState")}
              </p>
            </>
          )}
        </div>
        <Sparkles className="absolute top-4 right-4 h-16 w-16 text-duo-teal/10" />
      </div>

      {/* Quick stats */}
      {stats && stats.totalPlaces > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-duo-rose/5">
            <p className="text-2xl font-bold text-duo-rose">{stats.totalPlaces}</p>
            <p className="text-xs text-muted-foreground">{t("stats.places")}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-duo-teal/5">
            <p className="text-2xl font-bold text-duo-teal">{stats.visitedPlaces}</p>
            <p className="text-xs text-muted-foreground">{t("stats.visited")}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted">
            <p className="text-2xl font-bold">{stats.pendingPlaces}</p>
            <p className="text-xs text-muted-foreground">{t("stats.pending")}</p>
          </div>
        </div>
      )}

      {/* Connect partner - only when no partner */}
      {!hasPartner && !isLoading && (
        <Link href="/partner" className="block">
          <Card className="border-2 border-dashed border-duo-teal/30 bg-duo-teal/5 hover:bg-duo-teal/10 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 py-5 px-4">
              <div className="w-12 h-12 rounded-full bg-duo-teal/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-duo-teal" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t("connectPartner")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("connectPartnerDescription")}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-duo-teal flex-shrink-0" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Add new place */}
      <Link href="/places/new" className="block">
        <Card className="border-2 border-dashed border-duo-rose/20 bg-duo-rose/5 hover:bg-duo-rose/10 transition-colors cursor-pointer">
          <CardContent className="flex items-center gap-4 py-5 px-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-duo-rose to-duo-teal flex items-center justify-center flex-shrink-0">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{t("addFirstPlace")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("addFirstPlaceDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Recent places */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-duo-rose" />
            <h2 className="font-semibold text-lg">{t("recent")}</h2>
          </div>
          {recentPlaces.length > 0 && (
            <Link href="/places">
              <Button variant="ghost" size="sm" className="text-duo-rose hover:text-duo-rose-dark">
                {t("seeAll")}
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <PlaceList
            places={recentPlaces}
            onToggleVisited={handleToggleVisited}
            emptyMessage={t("emptyState")}
          />
        )}
      </div>
    </div>
  );
}
