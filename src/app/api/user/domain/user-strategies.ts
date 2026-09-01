import { ValidationStrategy, ValidationResult } from "./validation.strategy";
import { UpdateProfileDto, ChangePasswordDto } from "./user-request.dto";

export class UpdateProfileStrategy implements ValidationStrategy<UpdateProfileDto> {
  validate(data: unknown): ValidationResult<UpdateProfileDto> {
    if (!data || typeof data !== "object") {
      return { success: false, error: "Dados inválidos" };
    }

    const { name, email, image, bannerColor } = data as Record<string, unknown>;

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
}

export class ChangePasswordStrategy implements ValidationStrategy<ChangePasswordDto> {
  validate(data: unknown): ValidationResult<ChangePasswordDto> {
    if (!data || typeof data !== "object") {
      return { success: false, error: "Dados inválidos" };
    }

    const { currentPassword, newPassword } = data as Record<string, unknown>;

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
}

export function validateWithStrategy<T>(
  strategy: ValidationStrategy<T>,
  data: unknown
): ValidationResult<T> {
  return strategy.validate(data);
}
