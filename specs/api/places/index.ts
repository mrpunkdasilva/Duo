import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/place";
import User from "@/models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ success: false, error: "Não autorizado" });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  if (!user?.coupleId) {
    return res.status(400).json({
      success: false,
      error: "Você precisa estar em um casal para gerenciar lugares",
    });
  }

  const coupleId = user.coupleId;

  switch (req.method) {
    case "GET":
      return handleGet(req, res, coupleId.toString());
    case "POST":
      return handlePost(req, res, coupleId.toString());
    case "PUT":
      return handlePut(req, res, coupleId.toString());
    case "DELETE":
      return handleDelete(req, res, coupleId.toString());
    default:
      return res.status(405).json({ success: false, error: "Método não permitido" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, coupleId: string) {
  try {
    const { category, visited, search, limit } = req.query;

    const filter: Record<string, unknown> = { coupleId };

    if (category) filter.category = category;
    if (visited !== undefined) filter.visited = visited === "true";
    if (search) filter.name = { $regex: search, $options: "i" };

    let query = Place.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const places = await query;

    return res.status(200).json({ success: true, data: places });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Erro ao buscar lugares" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, coupleId: string) {
  try {
    const { name, description, category, address, latitude, longitude, photoUrl, notes } =
      req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Nome é obrigatório" });
    }

    const place = await Place.create({
      coupleId,
      name,
      description,
      category,
      address,
      latitude,
      longitude,
      photoUrl,
      notes,
    });

    return res.status(201).json({ success: true, data: place });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Erro ao criar lugar" });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, coupleId: string) {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: "ID é obrigatório" });
    }

    const place = await Place.findOneAndUpdate({ _id: id, coupleId }, updateData, {
      new: true,
    });

    if (!place) {
      return res.status(404).json({ success: false, error: "Lugar não encontrado" });
    }

    return res.status(200).json({ success: true, data: place });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Erro ao atualizar lugar" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, coupleId: string) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: "ID é obrigatório" });
    }

    const place = await Place.findOneAndDelete({ _id: id, coupleId });

    if (!place) {
      return res.status(404).json({ success: false, error: "Lugar não encontrado" });
    }

    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Erro ao excluir lugar" });
  }
}
