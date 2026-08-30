import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/category";
import User from "@/models/user";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  if (!user?.coupleId) {
    return NextResponse.json({ success: true, data: [] });
  }

  const categories = await Category.find({ coupleId: user.coupleId }).sort({ order: 1 });

  return NextResponse.json({ success: true, data: categories });
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
      { success: false, error: "Você precisa estar em um casal para gerenciar categorias" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { name, icon, color } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Nome da categoria é obrigatório" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({
      coupleId: user.coupleId,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Já existe uma categoria com esse nome" },
        { status: 400 }
      );
    }

    const lastCategory = await Category.findOne({ coupleId: user.coupleId }).sort({ order: -1 });
    const newOrder = lastCategory ? lastCategory.order + 1 : 0;

    const category = await Category.create({
      coupleId: user.coupleId,
      name: name.trim(),
      icon: icon?.trim() || undefined,
      color: color?.trim() || undefined,
      order: newOrder,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar categoria" },
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
      { success: false, error: "Você precisa estar em um casal para gerenciar categorias" },
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

    if (updateData.name?.trim()) {
      const existingCategory = await Category.findOne({
        coupleId: user.coupleId,
        name: { $regex: new RegExp(`^${updateData.name.trim()}$`, "i") },
        _id: { $ne: id },
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: "Já existe uma categoria com esse nome" },
          { status: 400 }
        );
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, coupleId: user.coupleId },
      updateData,
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar categoria" },
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
      { success: false, error: "Você precisa estar em um casal para gerenciar categorias" },
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

    const category = await Category.findOneAndDelete({
      _id: id,
      coupleId: user.coupleId,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao excluir categoria" },
      { status: 500 }
    );
  }
}
