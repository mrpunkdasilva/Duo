import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/place";
import User from "@/models/user";
import { DashboardStats, PlaceCategory, PLACE_CATEGORIES } from "@/specs/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ success: false, error: "Não autorizado" });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });

    if (!user?.coupleId) {
      return res.status(200).json({
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

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return res.status(500).json({ success: false, error: "Erro ao buscar estatísticas" });
  }
}
