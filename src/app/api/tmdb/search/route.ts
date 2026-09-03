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
    return NextResponse.json({ data: data.results });
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return NextResponse.json(
      { error: "Failed to search TMDB" },
      { status: 500 }
    );
  }
}
