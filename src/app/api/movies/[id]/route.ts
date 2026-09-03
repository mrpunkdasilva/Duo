import { NextRequest, NextResponse } from "next/server";
import { getMovieDetail, getTVShowDetail, getMovieCredits, getTVShowCredits } from "@/lib/tmdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) {
    return NextResponse.json(
      { error: "Invalid movie ID" },
      { status: 400 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "movie";

  try {
    let detail;
    let credits;

    if (type === "tv") {
      detail = await getTVShowDetail(movieId);
      credits = await getTVShowCredits(movieId);
    } else {
      detail = await getMovieDetail(movieId);
      credits = await getMovieCredits(movieId);
    }

    return NextResponse.json({
      data: {
        ...detail,
        credits,
      },
    });
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie detail" },
      { status: 500 }
    );
  }
}
