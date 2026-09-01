import { UpdateProfileRequest, ChangePasswordRequest } from "./user.types";

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateUpdateProfile(
  body: unknown
): ValidationResult<UpdateProfileRequest> {
  if (!body || typeof body !== "object") {
    return { success: false, error: "Dados inválidos" };
  }

  const { name, email, image, bannerColor } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Nome é obrigatório" };
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { success: false, error: "Email inválido" };
  }

  return {
    success: true,
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      image: typeof image === "string" ? image : undefined,
      bannerColor: typeof bannerColor === "string" ? bannerColor : undefined,
    },
  };
}

export function validateChangePassword(
  body: unknown
): ValidationResult<ChangePasswordRequest> {
  if (!body || typeof body !== "object") {
    return { success: false, error: "Dados inválidos" };
  }

  const { currentPassword, newPassword } = body as Record<string, unknown>;

  if (!currentPassword || typeof currentPassword !== "string") {
    return { success: false, error: "Senha atual é obrigatória" };
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return {
      success: false,
      error: "Nova senha deve ter pelo menos 6 caracteres",
    };
  }

  return {
    success: true,
    data: { currentPassword, newPassword },
  };
}
