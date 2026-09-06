import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import TimeCapsule from "@/models/timecapsule";

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
    const status = searchParams.get("status");

    const query: Record<string, unknown> = { coupleId };

    if (status === "sealed") {
      query.isOpened = false;
    } else if (status === "opened") {
      query.isOpened = true;
    }

    const capsules = await TimeCapsule.find(query).sort({ createdAt: -1 });

    const now = new Date();
    const enrichedCapsules = capsules.map((capsule) => {
      const capsuleObj = capsule.toObject();
      const openAt = new Date(capsuleObj.openAt);
      return {
        ...capsuleObj,
        id: capsuleObj._id.toString(),
        isReady: now >= openAt && !capsuleObj.isOpened,
      };
    });

    return NextResponse.json({ data: enrichedCapsules });
  } catch (error) {
    console.error("Error fetching timecapsules:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cápsulas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, message, photo, openAt, recipientId, recipientName } = body;

    if (!title || !message || !openAt) {
      return NextResponse.json(
        { error: "Título, mensagem e data de abertura são obrigatórios" },
        { status: 400 }
      );
    }

    const capsule = await TimeCapsule.create({
      coupleId,
      title,
      message,
      photo,
      openAt: new Date(openAt),
      senderId: session.user.id,
      senderName: session.user.name,
      recipientId,
      recipientName,
      isOpened: false,
    });

    return NextResponse.json({ data: capsule }, { status: 201 });
  } catch (error) {
    console.error("Error creating timecapsule:", error);
    return NextResponse.json(
      { error: "Erro ao criar cápsula" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const capsule = await TimeCapsule.findById(id);
    if (!capsule) {
      return NextResponse.json({ error: "Cápsula não encontrada" }, { status: 404 });
    }

    const now = new Date();
    const openAt = new Date(capsule.openAt);

    if (now < openAt) {
      return NextResponse.json(
        { error: "Essa cápsula ainda não pode ser aberta" },
        { status: 400 }
      );
    }

    capsule.isOpened = true;
    capsule.openedAt = now;
    await capsule.save();

    return NextResponse.json({ data: capsule });
  } catch (error) {
    console.error("Error opening timecapsule:", error);
    return NextResponse.json(
      { error: "Erro ao abrir cápsula" },
      { status: 500 }
    );
  }
}
