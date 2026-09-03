"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, Tv, Heart, ArrowLeft, Calendar, Clock, Eye, CheckCircle, Clock as ClockIcon, ListPlus } from "lucide-react";
import { MediaItem, GENRE_MAP } from "@/types";
import { getImageUrl } from "@/lib/tmdb";
import { MovieComments } from "@/app/(protected)/movies/components/movie-comments.component";
import { MovieCoupleRating } from "@/app/(protected)/movies/components/movie-couple-rating.component";
import Link from "next/link";

type WatchStatus = "not_watched" | "watching" | "watched" | "to_watch";

const WATCH_STATUS_OPTIONS: { value: WatchStatus; label: string; icon: typeof Eye; color: string }[] = [
  { value: "not_watched", label: "Não Assistido", icon: Eye, color: "text-gray-500" },
  { value: "watching", label: "Assistindo", icon: ClockIcon, color: "text-blue-500" },
  { value: "watched", label: "Assistido", icon: CheckCircle, color: "text-green-500" },
  { value: "to_watch", label: "Para Assistir", icon: ListPlus, color: "text-yellow-500" },
];

interface MovieDetailViewProps {
  movie: MediaItem;
  movieId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserImage?: string;
}

export function MovieDetailView({
  movie,
  movieId,
  currentUserId,
  currentUserName,
  currentUserImage,
}: MovieDetailViewProps) {
  const title = movie.title || movie.name || "Sem título";
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const genres = (movie.genre_ids || [])
    .map((id: number) => GENRE_MAP[id])
    .filter(Boolean);

  const watchStatuses = movie.watchStatuses || [];
  const currentUserStatus = watchStatuses.find(
    (ws) => ws.userId === currentUserId
  )?.status || "not_watched";

  const [watchStatus, setWatchStatus] = useState<WatchStatus>(currentUserStatus as WatchStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleWatchStatusChange = async (newStatus: WatchStatus) => {
    if (!movieId) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch("/api/movies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movieId,
          watchStatus: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      setWatchStatus(newStatus);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

        <Separator className="my-6" />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Status de Visualização</h2>
          <div className="grid grid-cols-2 gap-2">
            {WATCH_STATUS_OPTIONS.map((option) => {
              const isSelected = watchStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleWatchStatusChange(option.value)}
                  disabled={isUpdatingStatus}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-duo-rose/10 text-duo-rose border border-duo-rose/30"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <option.icon className={`h-4 w-4 ${isSelected ? option.color : ""}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        {movieId && (
          <MovieCoupleRating movieId={movieId} />
        )}

        <Separator className="my-6" />

        {movieId && (
          <MovieComments
            movieId={movieId}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserImage={currentUserImage}
          />
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}
