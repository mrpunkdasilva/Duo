import { getUser, updateProfile, changePassword } from "@/app/api/user/application/use-cases/user.service";

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/app/api/user/infra/repositories/user.repository", () => ({
  findUserById: jest.fn(),
  findUserByIdWithPassword: jest.fn(),
  findUserByEmail: jest.fn(),
  saveUser: jest.fn(),
}));

jest.mock("@/app/api/user/infra/mappers/user.mapper", () => ({
  toUserData: jest.fn((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || null,
    bannerColor: user.bannerColor || null,
    createdAt: user.createdAt,
  })),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import {
  findUserById,
  findUserByIdWithPassword,
  findUserByEmail,
  saveUser,
} from "@/app/api/user/infra/repositories/user.repository";
import bcrypt from "bcryptjs";

describe("user.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return user data when user found", async () => {
      // Arrange
      const mockUser = {
        _id: { toString: () => "user123" },
        name: "Test",
        email: "test@test.com",
        image: "",
        bannerColor: "",
        createdAt: new Date(),
      };
      (findUserById as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await getUser("user123");

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe("user123");
    });

    it("should return null when user not found", async () => {
      // Arrange
      (findUserById as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getUser("user123");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should throw when user not found", async () => {
      // Arrange
      (findUserById as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        updateProfile("user123", { name: "Test", email: "test@test.com" })
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("should throw when email is already taken", async () => {
      // Arrange
      const mockUser = {
        _id: { toString: () => "user123" },
        name: "Test",
        email: "old@test.com",
        image: "",
        bannerColor: "",
        createdAt: new Date(),
      };
      (findUserById as jest.Mock).mockResolvedValue(mockUser);
      (findUserByEmail as jest.Mock).mockResolvedValue({ _id: "other" });

      // Act & Assert
      await expect(
        updateProfile("user123", { name: "Test", email: "new@test.com" })
      ).rejects.toThrow("Este email já está em uso");
    });

    it("should save and return user when update succeeds", async () => {
      // Arrange
      const mockUser = {
        _id: { toString: () => "user123" },
        name: "Old Name",
        email: "old@test.com",
        image: "",
        bannerColor: "",
        createdAt: new Date(),
      };
      (findUserById as jest.Mock).mockResolvedValue(mockUser);
      (findUserByEmail as jest.Mock).mockResolvedValue(null);
      (saveUser as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await updateProfile("user123", {
        name: "New Name",
        email: "new@test.com",
      });

      // Assert
      expect(saveUser).toHaveBeenCalled();
      expect(result.name).toBe("New Name");
    });
  });

  describe("changePassword", () => {
    it("should throw when user not found", async () => {
      // Arrange
      (findUserByIdWithPassword as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        changePassword("user123", {
          currentPassword: "old",
          newPassword: "new123",
        })
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("should throw when user has no password (social login)", async () => {
      // Arrange
      const mockUser = { _id: "user123", password: null };
      (findUserByIdWithPassword as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        changePassword("user123", {
          currentPassword: "old",
          newPassword: "new123",
        })
      ).rejects.toThrow("Conta sem senha (login social)");
    });

    it("should throw when current password is wrong", async () => {
      // Arrange
      const mockUser = { _id: "user123", password: "hashed" };
      (findUserByIdWithPassword as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        changePassword("user123", {
          currentPassword: "wrong",
          newPassword: "new123",
        })
      ).rejects.toThrow("Senha atual incorreta");
    });

    it("should hash new password and save when change succeeds", async () => {
      // Arrange
      const mockUser = {
        _id: "user123",
        password: "hashed",
      };
      (findUserByIdWithPassword as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newhashed");
      (saveUser as jest.Mock).mockResolvedValue(undefined);

      // Act
      await changePassword("user123", {
        currentPassword: "correct",
        newPassword: "new123",
      });

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith("new123", 12);
      expect(saveUser).toHaveBeenCalled();
    });
  });
});
