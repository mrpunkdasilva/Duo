import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/place";
import User from "@/models/user";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  if (!user?.coupleId) {
    return NextResponse.json({ success: true, data: [] });
  }

  const coupleId = user.coupleId;
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const visited = searchParams.get("visited");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");

  const filter: Record<string, unknown> = { coupleId };

  if (category) filter.category = category;
  if (visited !== null) filter.visited = visited === "true";
  if (search) filter.name = { $regex: search, $options: "i" };

  let query = Place.find(filter).sort({ createdAt: -1 });

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  const places = await query;

  return NextResponse.json({ success: true, data: places });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  if (!user?.coupleId) {
    return NextResponse.json(
      { success: false, error: "Você precisa estar em um casal para gerenciar lugares" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { name, description, category, address, latitude, longitude, photoUrl, notes } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const place = await Place.create({
      coupleId: user.coupleId,
      name,
      description,
      category,
      address,
      latitude,
      longitude,
      photoUrl,
      notes,
    });

    return NextResponse.json({ success: true, data: place }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lugar:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar lugar" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  if (!user?.coupleId) {
    return NextResponse.json(
      { success: false, error: "Você precisa estar em um casal para gerenciar lugares" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    const place = await Place.findOneAndUpdate(
      { _id: id, coupleId: user.coupleId },
      updateData,
      { new: true }
    );

    if (!place) {
      return NextResponse.json(
        { success: false, error: "Lugar não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: place });
  } catch (error) {
    console.error("Erro ao atualizar lugar:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar lugar" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  if (!user?.coupleId) {
    return NextResponse.json(
      { success: false, error: "Você precisa estar em um casal para gerenciar lugares" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    const place = await Place.findOneAndDelete({
      _id: id,
      coupleId: user.coupleId,
    });

    if (!place) {
      return NextResponse.json(
        { success: false, error: "Lugar não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Erro ao excluir lugar:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao excluir lugar" },
      { status: 500 }
    );
  }
}
