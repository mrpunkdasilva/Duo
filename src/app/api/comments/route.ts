import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/comment";
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

  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { success: false, error: "ID do lugar é obrigatório" },
      { status: 400 }
    );
  }

  const comments = await Comment.find({
    placeId,
    coupleId: user.coupleId,
  })
    .populate("userId", "name image")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: comments });
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
      { success: false, error: "Você precisa estar em um casal para comentar" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { placeId, text } = body;

    if (!placeId || !text?.trim()) {
      return NextResponse.json(
        { success: false, error: "ID do lugar e texto são obrigatórios" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      placeId,
      userId: user._id,
      coupleId: user.coupleId,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate("userId", "name image");

    return NextResponse.json({ success: true, data: populatedComment }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar comentário" },
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
      { success: false, error: "Você precisa estar em um casal para excluir comentários" },
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

    const comment = await Comment.findOneAndDelete({
      _id: id,
      userId: user._id,
      coupleId: user.coupleId,
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Erro ao excluir comentário:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao excluir comentário" },
      { status: 500 }
    );
  }
}
