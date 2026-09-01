import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUser, updateProfile, changePassword } from "./user.service";
import { UpdateProfileStrategy, ChangePasswordStrategy, validateWithStrategy } from "../domain/user-strategies";
import logger from "@/lib/logger";

interface SessionUser {
  id?: string;
}

const updateProfileStrategy = new UpdateProfileStrategy();
const changePasswordStrategy = new ChangePasswordStrategy();

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as SessionUser).id || null;
}

export async function getProfile() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    logger.warn("Unauthorized access attempt");
    return { status: 401 as const, body: { error: "Não autorizado" } };
  }

  const user = await getUser(userId);
  if (!user) {
    return { status: 404 as const, body: { error: "Usuário não encontrado" } };
  }

  return { status: 200 as const, body: { data: user } };
}

export async function updateProfileController(body: unknown) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { status: 401 as const, body: { error: "Não autorizado" } };
  }

  const validation = validateWithStrategy(updateProfileStrategy, body);
  if (!validation.success) {
    return { status: 400 as const, body: { error: validation.error } };
  }

  try {
    const user = await updateProfile(userId, validation.data!);
    return { status: 200 as const, body: { data: user } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno";
    logger.error({ userId, error: message }, "Error updating profile");
    return { status: 400 as const, body: { error: message } };
  }
}

export async function changePasswordController(body: unknown) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { status: 401 as const, body: { error: "Não autorizado" } };
  }

  const validation = validateWithStrategy(changePasswordStrategy, body);
  if (!validation.success) {
    return { status: 400 as const, body: { error: validation.error } };
  }

  try {
    await changePassword(userId, validation.data!);
    return { status: 200 as const, body: { data: { success: true } } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno";
    logger.error({ userId, error: message }, "Error changing password");
    return { status: 400 as const, body: { error: message } };
  }
}
