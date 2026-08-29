import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import Couple from "@/models/couple";
import { generateInviteCode } from "@/lib/helpers";

interface SessionUser {
  id?: string;
}

interface PopulatedUser {
  _id: { toString(): string };
  name: string;
  image?: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById((session.user as SessionUser).id).populate("coupleId");

    if (!user) {
      return NextResponse.json({ data: null });
    }

    if (!user.coupleId) {
      return NextResponse.json({ data: null });
    }

    const couple = await Couple.findById(user.coupleId).populate("users", "name image email");

    if (!couple || couple.users.length < 2) {
      return NextResponse.json({ data: couple ? { inviteCode: couple.inviteCode, partner: null } : null });
    }

    const partner = couple.users.find(
      (u: PopulatedUser) => u._id.toString() !== user._id.toString()
    );

    return NextResponse.json({
      data: {
        inviteCode: couple.inviteCode,
        partner: partner
          ? { name: (partner as PopulatedUser).name, image: (partner as PopulatedUser).image }
          : null,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar casal:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById((session.user as SessionUser).id);

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (user.coupleId) {
      const couple = await Couple.findById(user.coupleId);
      if (couple) {
        return NextResponse.json({
          data: { inviteCode: couple.inviteCode },
        });
      }
      user.coupleId = undefined;
      await user.save();
    }

    let code = generateInviteCode();
    let existing = await Couple.findOne({ inviteCode: code });
    while (existing) {
      code = generateInviteCode();
      existing = await Couple.findOne({ inviteCode: code });
    }

    const couple = await Couple.create({
      inviteCode: code,
      users: [user._id],
    });

    user.coupleId = couple._id;
    await user.save();

    return NextResponse.json({
      data: { inviteCode: couple.inviteCode },
    });
  } catch (error) {
    console.error("Erro ao gerar código:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { inviteCode } = await request.json();

    if (!inviteCode || typeof inviteCode !== "string") {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById((session.user as SessionUser).id);

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (user.coupleId) {
      const existingCouple = await Couple.findById(user.coupleId);
      if (existingCouple && existingCouple.users.length >= 2) {
        return NextResponse.json(
          { error: "Você já está vinculado a um casal" },
          { status: 400 }
        );
      }
      if (existingCouple) {
        await Couple.deleteOne({ _id: existingCouple._id });
      }
      user.coupleId = undefined;
      await user.save();
    }

    const couple = await Couple.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!couple) {
      return NextResponse.json(
        { error: "Código inválido ou casal não encontrado" },
        { status: 404 }
      );
    }

    if (couple.users.length >= 2) {
      return NextResponse.json(
        { error: "Este casal já está completo" },
        { status: 400 }
      );
    }

    const isAlreadyInCouple = couple.users.some(
      (userId: { toString(): string }) => userId.toString() === user._id.toString()
    );

    if (isAlreadyInCouple) {
      return NextResponse.json(
        { error: "Você já faz parte deste casal" },
        { status: 400 }
      );
    }

    couple.users.push(user._id);
    await couple.save();

    user.coupleId = couple._id;
    await user.save();

    const populatedCouple = await Couple.findById(couple._id).populate(
      "users",
      "name image email"
    );

    const partner = populatedCouple.users.find(
      (u: PopulatedUser) => u._id.toString() !== user._id.toString()
    );

    return NextResponse.json({
      data: {
        partnerName: (partner as PopulatedUser)?.name || "Parceiro(a)",
      },
    });
  } catch (error) {
    console.error("Erro ao vincular casal:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
