"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/types";
import { MapPin, Check, Clock, TrendingUp } from "lucide-react";

interface StatsCardProps {
  stats: DashboardStats | null;
}

export function StatsCard({ stats }: StatsCardProps) {
  if (!stats) return null;

  const items = [
    {
      label: "Total de Lugares",
      value: stats.totalPlaces,
      icon: MapPin,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Visitados",
      value: stats.visitedPlaces,
      icon: Check,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Pendentes",
      value: stats.pendingPlaces,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Taxa de Visita",
      value: stats.totalPlaces > 0
        ? `${Math.round((stats.visitedPlaces / stats.totalPlaces) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
