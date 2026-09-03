"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { ArrowLeft, Search, Loader2, Film, Tv, Star } from "lucide-react";
import { MediaItem } from "@/types";
import { getImageUrl } from "@/lib/tmdb";
import Link from "next/link";

export default function NewMoviePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tmdb/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar filmes");
      }

      const data = await response.json();
      setResults(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar filmes");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleAddMovie = async (item: MediaItem) => {
    setAddingId(item.id);

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId: (session?.user as { coupleId?: string })?.coupleId,
          tmdbId: item.id,
          mediaType: item.media_type,
          title: item.title,
          name: item.name,
          overview: item.overview,
          posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          releaseDate: item.release_date,
          firstAirDate: item.first_air_date,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          genreIds: item.genre_ids,
          popularity: item.popularity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao adicionar filme");
      }

      router.push("/movies");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar filme");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="px-4 pt-4 max-w-lg mx-auto space-y-4">
      <div className="space-y-4">
        <Link href="/movies">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground mb-3">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </Link>
        <Heading as="h1" variant="page">
          Adicionar Filme/Série
        </Heading>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Busque um filme ou série para adicionar à sua lista
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar filme ou série..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 h-12 rounded-xl bg-muted/50"
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || isLoading}
          className="w-full h-12 bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <Heading as="h2" variant="section">
            Resultados ({results.length})
          </Heading>

          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="relative w-full h-[50vh] min-h-[400px] rounded-2xl overflow-hidden"
              >
                {item.backdrop_path ? (
                  <img
                    src={getImageUrl(item.backdrop_path, "original")}
                    alt={item.title || item.name || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : item.poster_path ? (
                  <img
                    src={getImageUrl(item.poster_path, "original")}
                    alt={item.title || item.name || ""}
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

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge className="bg-black/60 text-white border-0 text-xs px-3 py-1 backdrop-blur-sm">
                    {item.media_type === "movie" ? "Filme" : "Série"}
                  </Badge>
                  <span className="bg-black/60 text-white/80 border-0 text-xs px-3 py-1 rounded-md backdrop-blur-sm">
                    {item.release_date || item.first_air_date
                      ? new Date(
                          item.release_date || item.first_air_date || ""
                        ).getFullYear()
                      : "N/A"}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-black/60 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm font-semibold">
                      {item.vote_average?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <div className="flex gap-4">
                    {item.poster_path && (
                      <div className="flex-shrink-0 w-20 aspect-[2/3] rounded-lg overflow-hidden shadow-xl border-2 border-white/20">
                        <img
                          src={getImageUrl(item.poster_path, "w200")}
                          alt={item.title || item.name || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-white line-clamp-2">
                        {item.title || item.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-white/80 line-clamp-3 leading-relaxed">
                    {item.overview}
                  </p>

                  <Button
                    onClick={() => handleAddMovie(item)}
                    disabled={addingId === item.id}
                    className="w-full bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
                  >
                    {addingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isLoading && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum resultado encontrado</p>
        </div>
      )}
    </div>
  );
}
