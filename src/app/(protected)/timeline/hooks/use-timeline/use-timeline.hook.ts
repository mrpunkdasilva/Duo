"use client";

import { useState, useMemo } from "react";
import type { TimelineItem, TimelineMonth } from "../../types/timeline.types";

const MOCK_ITEMS: TimelineItem[] = [
  {
    id: "1",
    type: "memory",
    title: "Pizzaria Augusta",
    date: "2026-08-15",
    photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
    description: "Primeira pizza juntos! Ela pediu marguerita, eu pedi quatro queijos. Choveu no caminho de volta.",
    rating: 4.5,
    sourceId: "1",
    category: "restaurante",
  },
  {
    id: "2",
    type: "movie",
    title: "O Tempo",
    date: "2026-08-10",
    photo: "https://image.tmdb.org/t/p/w300/oKt4J3TFjWirVwBqoHyIvv5IImd.jpg",
    description: "Romance sci-fi incrível. Dormimos abraçados depois.",
    rating: 5,
    sourceId: "2",
  },
  {
    id: "3",
    type: "place",
    title: "Praia da Lua",
    date: "2026-07-20",
    photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop",
    description: "Praia paradíaca no litoral norte. Água cristalina!",
    rating: 4.8,
    sourceId: "3",
    category: "praia",
  },
  {
    id: "4",
    type: "place",
    title: "Museu de Arte Contemporânea",
    date: "2026-07-05",
    photo: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=300&h=300&fit=crop",
    description: "Exposição de arte brasileira. Ficamos 3 horas lá!",
    rating: 4.2,
    sourceId: "4",
    category: "museu",
  },
  {
    id: "5",
    type: "movie",
    title: "Divertida Mente 2",
    date: "2026-06-28",
    photo: "https://image.tmdb.org/t/p/w300/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    description: "Choramos de rir e de emoção. Filme perfeito.",
    rating: 4.7,
    sourceId: "5",
  },
  {
    id: "6",
    type: "memory",
    title: "Café Floresta",
    date: "2026-06-15",
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
    description: "Café especial com vista pro parque. Nosso lugar secreto.",
    rating: 4.9,
    sourceId: "6",
    category: "cafeteria",
  },
  {
    id: "7",
    type: "place",
    title: "Parque Ibirapuera",
    date: "2026-05-30",
    photo: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop",
    description: "Passeio de domingo. Alugamos bikes e andamos por 2h.",
    rating: 4.3,
    sourceId: "7",
    category: "parque",
  },
  {
    id: "8",
    type: "movie",
    title: "Alias",
    date: "2026-05-18",
    photo: "https://image.tmdb.org/t/p/w300/mHVfYgWVFw5FhZpavvhzFkzFfX.jpg",
    description: "Série que estamos assistindo juntos. Já estamos na temporada 3!",
    rating: 4.4,
    sourceId: "8",
  },
];

export function useTimeline() {
  const [items] = useState<TimelineItem[]>(MOCK_ITEMS);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

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
