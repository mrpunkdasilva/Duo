"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MOCK_MOVIES, MOCK_TV_SHOWS } from "@/app/(protected)/movies/data/mock-movies";
import { MovieDetailView } from "./views/movie-detail.view";
import { MediaDetail } from "@/types";

export default function MovieDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const id = Number(params.id);

  const movie = [...MOCK_MOVIES, ...MOCK_TV_SHOWS].find(
    (item) => item.id === id
  ) as MediaDetail | undefined;

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Filme não encontrado</p>
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
