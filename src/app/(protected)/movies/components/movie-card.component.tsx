"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Film, Tv, Heart, Users } from "lucide-react";
import { MediaItem, GENRE_MAP } from "@/types";
import { getImageUrl } from "@/lib/tmdb";

interface MovieCardProps {
  item: MediaItem;
  onAddToList?: (item: MediaItem) => void;
  onToggleFavorite?: (item: MediaItem) => void;
  isFavorite?: boolean;
}

export function MovieCard({
  item,
  onAddToList,
  onToggleFavorite,
  isFavorite = false,
}: MovieCardProps) {
  const title = item.title || item.name || "Sem título";
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const genres = (item.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const coupleRating = item.coupleRating;
  const averageRating = coupleRating
    ? Object.values(coupleRating).filter(Boolean).reduce((a, b) => a + b, 0) /
      Object.values(coupleRating).filter(Boolean).length
    : 0;

  return (
    <Link
      href={`/movies/${item.id}`}
      className="block relative w-full h-[70vh] min-h-[500px] rounded-2xl overflow-hidden group"
    >
      {item.backdrop_path ? (
        <img
          src={getImageUrl(item.backdrop_path, "original")}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : item.poster_path ? (
        <img
          src={getImageUrl(item.poster_path, "original")}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-duo-rose to-duo-teal flex items-center justify-center">
          {item.media_type === "movie" ? (
            <Film className="h-24 w-24 text-white/30" />
          ) : (
            <Tv className="h-24 w-24 text-white/30" />
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Badge className="bg-black/60 text-white border-0 text-xs px-3 py-1 backdrop-blur-sm">
          {item.media_type === "movie" ? "Filme" : "Série"}
        </Badge>
        {year && (
          <Badge className="bg-black/60 text-white/80 border-0 text-xs px-3 py-1 backdrop-blur-sm">
            {year}
          </Badge>
        )}
      </div>

      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1.5 bg-duo-rose/80 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <Users className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-semibold">
            {averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-white line-clamp-2">{title}</h3>
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  className="bg-white/20 text-white border-0 text-xs px-2.5 py-1 backdrop-blur-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-white/80 line-clamp-3 leading-relaxed">
          {item.overview}
        </p>

        <div className="flex items-center gap-3">
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(item);
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
