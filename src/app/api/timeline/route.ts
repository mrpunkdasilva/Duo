import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/place";
import Movie from "@/models/movie";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const coupleId = (session.user as Record<string, string>).coupleId;
    if (!coupleId) {
      return NextResponse.json({ error: "Casal não encontrado" }, { status: 404 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const type = searchParams.get("type");

    const timelineItems: Array<{
      id: string;
      type: "place" | "movie" | "memory";
      title: string;
      date: string;
      photo?: string;
      description?: string;
      rating?: number;
      sourceId: string;
      category?: string;
    }> = [];

    if (!type || type === "place") {
      const places = await Place.find({
        coupleId,
        visited: true,
      }).sort({ updatedAt: -1 });

      for (const place of places) {
        const placeObj = place.toObject();
        const date = placeObj.updatedAt || placeObj.createdAt;

        if (month) {
          const itemMonth = new Date(date).toISOString().slice(0, 7);
          if (itemMonth !== month) continue;
        }

        const avgRating = placeObj.rating
          ? (placeObj.rating.ambiente +
              placeObj.rating.romance +
              placeObj.rating.custo +
              placeObj.rating.experiencia) / 4
          : undefined;

        timelineItems.push({
          id: placeObj._id.toString(),
          type: placeObj.memory ? "memory" : "place",
          title: placeObj.name,
          date: new Date(date).toISOString(),
          photo: placeObj.memory?.photo || placeObj.photoUrl,
          description: placeObj.memory?.text || placeObj.description,
          rating: avgRating,
          sourceId: placeObj._id.toString(),
          category: placeObj.category,
        });
      }
    }

    if (!type || type === "movie") {
      const movies = await Movie.find({
        coupleId,
        "watchStatuses.status": "watched",
      }).sort({ updatedAt: -1 });

      for (const movie of movies) {
        const movieObj = movie.toObject();
        const watchedStatus = movieObj.watchStatuses?.find(
          (s: { status: string }) => s.status === "watched"
        );
        const date = movieObj.updatedAt || movieObj.createdAt;

        if (month) {
          const itemMonth = new Date(date).toISOString().slice(0, 7);
          if (itemMonth !== month) continue;
        }

        const avgRating = movieObj.coupleRating
          ? (movieObj.coupleRating.romance +
              movieObj.coupleRating.diversao +
              movieObj.coupleRating.emocao +
              movieObj.coupleRating.recomendaria) / 4
          : undefined;

        timelineItems.push({
          id: movieObj._id.toString(),
          type: "movie",
          title: movieObj.title || movieObj.name,
          date: new Date(date).toISOString(),
          photo: movieObj.posterPath
            ? `https://image.tmdb.org/t/p/w300${movieObj.posterPath}`
            : undefined,
          description: movieObj.overview?.slice(0, 100),
          rating: avgRating,
          sourceId: movieObj.tmdbId.toString(),
        });
      }
    }

    timelineItems.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ data: timelineItems });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Erro ao buscar timeline" },
      { status: 500 }
    );
  }
}
