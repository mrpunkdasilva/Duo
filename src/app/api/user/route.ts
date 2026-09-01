import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

interface SessionUser {
  id?: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById((session.user as SessionUser).id).select(
      "name email image bannerColor createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
        bannerColor: user.bannerColor,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, image, bannerColor } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const userId = (session.user as SessionUser).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (email.toLowerCase() !== user.email) {
      const existing = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 }
        );
      }
    }

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    if (image !== undefined) {
      user.image = image || "";
    }
    if (bannerColor !== undefined) {
      user.bannerColor = bannerColor || "";
    }
    await user.save();

    return NextResponse.json({
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
        bannerColor: user.bannerColor,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "Senha atual é obrigatória" },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Nova senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = (session.user as SessionUser).id;
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Conta sem senha (login social)" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
