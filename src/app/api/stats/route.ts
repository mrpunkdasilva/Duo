import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/place";
import User from "@/models/user";
import { DashboardStats, PlaceCategory } from "@/types";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });

    if (!user?.coupleId) {
      return NextResponse.json({
        success: true,
        data: {
          totalPlaces: 0,
          visitedPlaces: 0,
          pendingPlaces: 0,
          categoryBreakdown: {},
          recentPlaces: [],
        },
      });
    }

    const coupleId = user.coupleId;

    const [totalPlaces, visitedPlaces, placesByCategory, recentPlaces] = await Promise.all([
      Place.countDocuments({ coupleId }),
      Place.countDocuments({ coupleId, visited: true }),
      Place.aggregate([
        { $match: { coupleId } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      Place.find({ coupleId }).sort({ createdAt: -1 }).limit(5),
    ]);

    const categoryBreakdown: Record<string, number> = {};
    placesByCategory.forEach((item: any) => {
      categoryBreakdown[item._id] = item.count;
    });

    const stats: DashboardStats = {
      totalPlaces,
      visitedPlaces,
      pendingPlaces: totalPlaces - visitedPlaces,
      categoryBreakdown: categoryBreakdown as Record<PlaceCategory, number>,
      recentPlaces,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
