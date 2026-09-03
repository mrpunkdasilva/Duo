import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const data = await searchMulti(query);
    const filtered = (data.results || []).filter(
      (item: { media_type?: string }) =>
        item.media_type === "movie" || item.media_type === "tv"
    );
    return NextResponse.json({ data: filtered });
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return NextResponse.json(
      { error: "Failed to search TMDB" },
      { status: 500 }
    );
  }
}
