"use client";

import { useState, useEffect, useMemo } from "react";
import type { TimelineItem, TimelineMonth } from "../../types/timeline.types";

export function useTimeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch("/api/timeline");
        if (!res.ok) {
          throw new Error("Erro ao buscar timeline");
        }
        const data = await res.json();
        setItems(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  const months: TimelineMonth[] = useMemo(() => {
    const grouped: Record<string, TimelineItem[]> = {};

    for (const item of items) {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(item);
    }

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, monthItems]) => {
        const [year, monthNum] = month.split("-");
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        const label = date.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        });

        return {
          month,
          label: label.charAt(0).toUpperCase() + label.slice(1),
          items: monthItems,
        };
      });
  }, [items]);

  return {
    items,
    months,
    isLoading,
    error,
  };
}
