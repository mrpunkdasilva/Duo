import { NextRequest, NextResponse } from "next/server";
import {
  searchMovies,
  searchTVShows,
  searchMulti,
  getTrending,
  getPopularMovies,
  getPopularTVShows,
} from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "multi";
  const page = searchParams.get("page") || "1";
  const trending = searchParams.get("trending");

  try {
    let data;

    if (trending) {
      data = await getTrending(trending as "day" | "week");
    } else if (query) {
      switch (type) {
        case "movie":
          data = await searchMovies(query, Number(page));
          break;
        case "tv":
          data = await searchTVShows(query, Number(page));
          break;
        default:
          data = await searchMulti(query, Number(page));
      }
    } else {
      const movies = await getPopularMovies(Number(page));
      const tvShows = await getPopularTVShows(Number(page));
      data = {
        page: 1,
        results: [
          ...movies.results.map((m) => ({ ...m, media_type: "movie" as const })),
          ...tvShows.results.map((s) => ({ ...s, media_type: "tv" as const })),
        ].sort((a, b) => b.popularity - a.popularity),
        total_results: movies.total_results + tvShows.total_results,
        total_pages: Math.max(movies.total_pages, tvShows.total_pages),
      };
    }

    return NextResponse.json({ data: data.results, total: data.total_results });
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: 500 }
    );
  }
}
