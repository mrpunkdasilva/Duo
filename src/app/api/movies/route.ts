import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Movie from "@/models/movie";
import User from "@/models/user";
import { SessionUser } from "@/types";

function transformMovie(movie: Record<string, unknown>) {
  return {
    id: movie.tmdbId,
    _id: movie._id,
    title: movie.title,
    name: movie.name,
    overview: movie.overview,
    poster_path: movie.posterPath,
    backdrop_path: movie.backdropPath,
    release_date: movie.releaseDate,
    first_air_date: movie.firstAirDate,
    vote_average: movie.voteAverage,
    vote_count: movie.voteCount,
    genre_ids: movie.genreIds,
    media_type: movie.mediaType,
    popularity: movie.popularity,
    addedBy: movie.addedBy,
    favoritedBy: movie.favoritedBy,
    coupleRating: movie.coupleRating,
    createdAt: movie.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as SessionUser)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session?.user?.email });
    const coupleId = user?.coupleId;

    if (!coupleId) {
      return NextResponse.json({ data: [] });
    }

    const searchParams = request.nextUrl.searchParams;
    const mediaType = searchParams.get("type");
    const favorite = searchParams.get("favorite");

    const query: Record<string, unknown> = { coupleId };

    if (mediaType) {
      query.mediaType = mediaType;
    }

    if (favorite === "true") {
      query.favoritedBy = userId;
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const transformed = movies.map((m) => transformMovie(m as Record<string, unknown>));

    return NextResponse.json({ data: transformed });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Erro ao buscar filmes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as SessionUser)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session?.user?.email });
    const coupleId = user?.coupleId;

    if (!coupleId) {
      return NextResponse.json(
        { error: "Você precisa estar em um casal para adicionar filmes" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      tmdbId,
      mediaType,
      title,
      name,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      firstAirDate,
      voteAverage,
      voteCount,
      genreIds,
      popularity,
      tagline,
      runtime,
      numberOfSeasons,
      numberOfEpisodes,
      status,
    } = body;

    if (!tmdbId || !mediaType || !title) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    const existingMovie = await Movie.findOne({ coupleId, tmdbId });

    if (existingMovie) {
      return NextResponse.json(
        { error: "Filme já adicionado" },
        { status: 409 }
      );
    }

    const movie = await Movie.create({
      coupleId,
      addedBy: userId,
      tmdbId,
      mediaType,
      title,
      name,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      firstAirDate,
      voteAverage: voteAverage || 0,
      voteCount: voteCount || 0,
      genreIds: genreIds || [],
      popularity: popularity || 0,
      tagline,
      runtime,
      numberOfSeasons,
      numberOfEpisodes,
      status,
      favoritedBy: [userId],
    });

    return NextResponse.json({ data: movie }, { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Erro ao criar filme" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { id, coupleRating, favorite } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do filme é obrigatório" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (coupleRating !== undefined) {
      updateData.coupleRating = coupleRating;
    }

    if (favorite !== undefined) {
      if (favorite) {
        updateData.$addToSet = { favoritedBy: session.user.id };
      } else {
        updateData.$pull = { favoritedBy: session.user.id };
      }
    }

    const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    if (!movie) {
      return NextResponse.json(
        { error: "Filme não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: movie });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar filme" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do filme é obrigatório" },
        { status: 400 }
      );
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return NextResponse.json(
        { error: "Filme não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Erro ao excluir filme" },
      { status: 500 }
    );
  }
}
