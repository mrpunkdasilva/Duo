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
    <div className="px-4 pt-4 max-w-lg mx-auto space-y-8">
      <div className="space-y-4">
        <Link href="/movies">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
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
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-muted">
                      {item.poster_path ? (
                        <img
                          src={getImageUrl(item.poster_path, "w200")}
                          alt={item.title || item.name || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {item.media_type === "movie" ? (
                            <Film className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <Tv className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">
                              {item.title || item.name}
                            </h3>
                            <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                              {item.media_type === "movie" ? "Filme" : "Série"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {item.release_date || item.first_air_date
                                ? new Date(
                                    item.release_date || item.first_air_date || ""
                                  ).getFullYear()
                                : "N/A"}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">
                                {item.vote_average.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleAddMovie(item)}
                          disabled={addingId === item.id}
                          className="bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90 flex-shrink-0"
                        >
                          {addingId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Adicionar"
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                        {item.overview}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
