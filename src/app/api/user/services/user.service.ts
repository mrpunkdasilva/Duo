import bcrypt from "bcryptjs";
import { UserData, UpdateProfileData, ChangePasswordData } from "../domain/user.types";
import { toUserData } from "../mapper/user.mapper";
import {
  findUserById,
  findUserByIdWithPassword,
  findUserByEmail,
  saveUser,
} from "../infra/user.repository";
import logger from "@/lib/logger";

export async function getUser(userId: string): Promise<UserData | null> {
  logger.info({ userId }, "Fetching user");

  const user = await findUserById(userId);
  if (!user) {
    logger.warn({ userId }, "User not found");
    return null;
  }

  return toUserData(user);
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileData
): Promise<UserData> {
  logger.info({ userId, email: data.email }, "Updating user profile");

  const user = await findUserById(userId);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (data.email !== user.email) {
    const existing = await findUserByEmail(data.email, userId);
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

  await saveUser(user);

  return toUserData(user);
}

export async function changePassword(
  userId: string,
  data: ChangePasswordData
): Promise<void> {
  logger.info({ userId }, "Changing user password");

  const user = await findUserByIdWithPassword(userId);
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
  await saveUser(user);
}
