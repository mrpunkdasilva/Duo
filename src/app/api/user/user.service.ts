import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { UserData, UpdateProfileRequest, ChangePasswordRequest } from "./user.types";

const USER_FIELDS = "name email image bannerColor createdAt";

export async function getUserById(userId: string): Promise<UserData | null> {
  await connectToDatabase();
  const user = await User.findById(userId).select(USER_FIELDS);

  if (!user) return null;

  return {
    name: user.name,
    email: user.email,
    image: user.image || null,
    bannerColor: user.bannerColor || null,
    createdAt: user.createdAt,
  };
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<UserData> {
  await connectToDatabase();
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (data.email !== user.email) {
    const existing = await User.findOne({
      email: data.email,
      _id: { $ne: userId },
    });
    if (existing) {
      throw new Error("Este email já está em uso");
    }
  }

  user.name = data.name;
  user.email = data.email;
  if (data.image !== undefined) {
    user.image = data.image || "";
  }
  if (data.bannerColor !== undefined) {
    user.bannerColor = data.bannerColor || "";
  }

  await user.save();

  return {
    name: user.name,
    email: user.email,
    image: user.image || null,
    bannerColor: user.bannerColor || null,
    createdAt: user.createdAt,
  };
}

export async function changeUserPassword(
  userId: string,
  data: ChangePasswordRequest
): Promise<void> {
  await connectToDatabase();
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (!user.password) {
    throw new Error("Conta sem senha (login social)");
  }

  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password
  );
  if (!isPasswordValid) {
    throw new Error("Senha atual incorreta");
  }

  user.password = await bcrypt.hash(data.newPassword, 12);
  await user.save();
}
