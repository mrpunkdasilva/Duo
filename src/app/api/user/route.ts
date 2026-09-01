import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, updateUserProfile, changeUserPassword } from "./user.service";
import { validateUpdateProfile, validateChangePassword } from "./user.validator";

interface SessionUser {
  id?: string;
}

function getAuthenticatedUserId(): Promise<string | null> {
  return getServerSession(authOptions).then((session) => {
    if (!session?.user) return null;
    return (session.user as SessionUser).id || null;
  });
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateUpdateProfile(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const user = await updateUserProfile(userId, validation.data!);
    return NextResponse.json({ data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno";
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateChangePassword(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await changeUserPassword(userId, validation.data!);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno";
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
