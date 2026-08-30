"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value = 0,
  onChange,
  label,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm text-muted-foreground w-28 flex-shrink-0">{label}</span>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={cn(
              "transition-transform",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                "transition-colors",
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-gray-200"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
