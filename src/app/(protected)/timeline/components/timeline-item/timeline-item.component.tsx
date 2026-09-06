import { MapPin, Film, Camera, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TimelineItem } from "../../types/timeline.types";

const TYPE_CONFIG = {
  place: {
    icon: MapPin,
    label: "Lugar",
    color: "text-duo-rose",
    bgColor: "bg-duo-rose/10",
  },
  movie: {
    icon: Film,
    label: "Filme",
    color: "text-duo-teal",
    bgColor: "bg-duo-teal/10",
  },
  memory: {
    icon: Camera,
    label: "Memória",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  restaurante: "bg-orange-500/10 text-orange-600",
  praia: "bg-blue-500/10 text-blue-600",
  museu: "bg-violet-500/10 text-violet-600",
  parque: "bg-green-500/10 text-green-600",
  cafeteria: "bg-amber-500/10 text-amber-600",
  bar: "bg-pink-500/10 text-pink-600",
  loja: "bg-purple-500/10 text-purple-600",
};

interface TimelineItemCardProps {
  item: TimelineItem;
}

export function TimelineItemCard({ item }: TimelineItemCardProps) {
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  const formattedDate = new Date(item.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });

  return (
    <Card className="ring-1 ring-foreground/10">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {item.photo && (
            <img
              src={item.photo}
              alt={item.title}
              className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${config.bgColor}`}>
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              <Badge variant="secondary" className="text-xs">
                {config.label}
              </Badge>
              {item.category && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${CATEGORY_COLORS[item.category] || ""}`}
                >
                  {item.category}
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-sm truncate">{item.title}</h3>
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                {formattedDate}
              </span>
              {item.rating !== undefined && item.rating > 0 && (
                <span className="flex items-center text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                  {item.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
