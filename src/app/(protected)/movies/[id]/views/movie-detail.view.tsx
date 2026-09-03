"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Film, Tv, Heart, Plus, ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { MediaDetail, GENRE_MAP } from "@/types";
import { getImageUrl } from "@/app/(protected)/movies/data/mock-movies";
import Link from "next/link";

interface MovieDetailViewProps {
  movie: MediaDetail;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
  onAddToList?: (movie: MediaDetail) => void;
}

export function MovieDetailView({
  movie,
  onToggleFavorite,
  isFavorite = false,
  onAddToList,
}: MovieDetailViewProps) {
  const title = movie.title || movie.name || "Sem título";
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const genres = movie.genre_ids
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] min-h-[400px]">
        {movie.backdrop_path ? (
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, "original")}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-duo-rose to-duo-teal flex items-center justify-center">
            {movie.media_type === "movie" ? (
              <Film className="h-32 w-32 text-white/30" />
            ) : (
              <Tv className="h-32 w-32 text-white/30" />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <Link href="/movies">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {onToggleFavorite && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onToggleFavorite(movie.id)}
              className="rounded-full bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </Button>
          )}
          {onAddToList && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onAddToList(movie)}
              className="rounded-full bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
              aria-label="Adicionar à lista"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 -mt-24 relative z-10 space-y-6">
        <div className="flex gap-4">
          {movie.poster_path && (
            <div className="flex-shrink-0 w-28 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border-2 border-background">
              <img
                src={getImageUrl(movie.poster_path, "w300")}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 pt-8">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {movie.tagline && (
              <p className="text-sm text-muted-foreground italic mt-1">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-duo-rose/10 text-duo-rose border-0">
            {movie.media_type === "movie" ? "Filme" : "Série"}
          </Badge>
          {year && (
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              {year}
            </Badge>
          )}
          {movie.runtime && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {movie.runtime} min
            </Badge>
          )}
          {movie.number_of_seasons && (
            <Badge variant="secondary">
              <Tv className="h-3 w-3 mr-1" />
              {movie.number_of_seasons} temporada{movie.number_of_seasons > 1 ? "s" : ""}
            </Badge>
          )}
          {movie.number_of_episodes && (
            <Badge variant="secondary">
              <Film className="h-3 w-3 mr-1" />
              {movie.number_of_episodes} episódio{movie.number_of_episodes > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold">{movie.vote_average.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({movie.vote_count.toLocaleString()} votos)
            </span>
          </div>
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Sinopse</h2>
          <p className="text-muted-foreground leading-relaxed">
            {movie.overview || "Sinopse não disponível."}
          </p>
        </div>

        {movie.status && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Status</h2>
            <p className="text-muted-foreground">{movie.status}</p>
          </div>
        )}

        {movie.production_companies && movie.production_companies.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Produção</h2>
            <div className="flex flex-wrap gap-2">
              {movie.production_companies.map((company) => (
                <Badge key={company.id} variant="secondary">
                  {company.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}
