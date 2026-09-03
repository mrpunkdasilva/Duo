"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoupleRatingProps {
  movieId: number;
  onRate?: (ratings: CoupleRatings) => void;
}

export interface CoupleRatings {
  romancio: number;
  diversao: number;
  emocao: number;
  recomendaria: number;
}

const RATING_CRITERIA = [
  { key: "romancio" as const, label: "Romântico", icon: Heart, color: "text-pink-500" },
  { key: "diversao" as const, label: "Diversão", icon: Sparkles, color: "text-yellow-500" },
  { key: "emocao" as const, label: "Emoção", icon: Star, color: "text-purple-500" },
  { key: "recomendaria" as const, label: "Recomendaria", icon: Heart, color: "text-red-500" },
];

export function MovieCoupleRating({ movieId, onRate }: CoupleRatingProps) {
  const [ratings, setRatings] = useState<CoupleRatings>({
    romancio: 0,
    diversao: 0,
    emocao: 0,
    recomendaria: 0,
  });

  const [hoveredStar, setHoveredStar] = useState<{ key: string; value: number } | null>(null);

  const handleRate = (key: keyof CoupleRatings, value: number) => {
    const newRatings = { ...ratings, [key]: value };
    setRatings(newRatings);
    onRate?.(newRatings);
  };

  const averageRating = Object.values(ratings).filter(Boolean).length > 0
    ? Object.values(ratings).filter(Boolean).reduce((a, b) => a + b, 0) /
      Object.values(ratings).filter(Boolean).length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading as="h2" variant="section">
          Avaliação do Casal
        </Heading>
        {averageRating > 0 && (
          <Badge className="bg-duo-rose/10 text-duo-rose border-0">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {averageRating.toFixed(1)}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {RATING_CRITERIA.map((criterion) => {
          const currentValue = ratings[criterion.key];
          const hoverValue = hoveredStar?.key === criterion.key ? hoveredStar.value : 0;
          const displayValue = hoverValue || currentValue;

          return (
            <div key={criterion.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <criterion.icon className={cn("h-4 w-4", criterion.color)} />
                  <span className="text-sm font-medium">{criterion.label}</span>
                </div>
                {currentValue > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {currentValue}/5
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(criterion.key, star)}
                    onMouseEnter={() =>
                      setHoveredStar({ key: criterion.key, value: star })
                    }
                    onMouseLeave={() => setHoveredStar(null)}
                    className="p-0.5 transition-transform hover:scale-110"
                    aria-label={`${criterion.label} ${star} estrela${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        star <= displayValue
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200 hover:text-yellow-200"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {Object.values(ratings).every((v) => v > 0) && (
        <div className="p-4 rounded-xl bg-duo-rose/5 border border-duo-rose/20">
          <p className="text-sm text-center text-muted-foreground">
            {averageRating >= 4
              ? "Vocês amaram esse filme! 🎬❤️"
              : averageRating >= 3
              ? "Bom filme para assistir juntos!"
              : "Talvez não seja o ideal para vocês dois"}
          </p>
        </div>
      )}
    </div>
  );
}
