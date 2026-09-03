"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { MovieDetailView } from "./views/movie-detail.view";
import { MediaDetail } from "@/types";

export default function MovieDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const id = Number(params.id);
  const [movie, setMovie] = useState<MediaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/movies/${id}?type=movie`);

        if (!response.ok) {
          throw new Error("Failed to fetch movie");
        }

        const data = await response.json();
        setMovie(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            {error || "Filme não encontrado"}
          </p>
          <a href="/movies" className="text-duo-rose hover:underline">
            Voltar para a lista
          </a>
        </div>
      </div>
    );
  }

  return (
    <MovieDetailView
      movie={movie}
      currentUserId={(session?.user as { id?: string })?.id}
      currentUserName={session?.user?.name || undefined}
      currentUserImage={session?.user?.image || undefined}
    />
  );
}
