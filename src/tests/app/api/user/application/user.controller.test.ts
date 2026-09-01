import {
  getProfile,
  updateProfileController,
  changePasswordController,
} from "@/app/api/user/application/controllers/user.controller";

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

jest.mock("@/app/api/user/application/use-cases/user.service", () => ({
  getUser: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
}));

import { getServerSession } from "next-auth";
import {
  getUser,
  updateProfile,
  changePassword,
} from "@/app/api/user/application/use-cases/user.service";

describe("user.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return 401 when no session", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const result = await getProfile();

      expect(result.status).toBe(401);
      expect(result.body.error).toBe("Não autorizado");
    });

    it("should return 404 when user not found", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });
      (getUser as jest.Mock).mockResolvedValue(null);

      const result = await getProfile();

      expect(result.status).toBe(404);
    });

    it("should return 200 with user data on success", async () => {
      const mockUser = { id: "user123", name: "Test" };
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });
      (getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await getProfile();

      expect(result.status).toBe(200);
      expect(result.body.data).toEqual(mockUser);
    });
  });

  describe("updateProfileController", () => {
    it("should return 401 when no session", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const result = await updateProfileController({
        name: "Test",
        email: "test@test.com",
      });

      expect(result.status).toBe(401);
    });

    it("should return 400 when validation fails", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });

      const result = await updateProfileController({ name: "" });

      expect(result.status).toBe(400);
    });

    it("should return 400 with error message when service throws", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });
      (updateProfile as jest.Mock).mockRejectedValue(new Error("Email já em uso"));

      const result = await updateProfileController({
        name: "Test",
        email: "test@test.com",
      });

      expect(result.status).toBe(400);
      expect(result.body.error).toBe("Email já em uso");
    });

    it("should return 200 with user data on success", async () => {
      const mockUser = { id: "user123", name: "Test" };
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });
      (updateProfile as jest.Mock).mockResolvedValue(mockUser);

      const result = await updateProfileController({
        name: "Test",
        email: "test@test.com",
      });

      expect(result.status).toBe(200);
      expect(result.body.data).toEqual(mockUser);
    });
  });

  describe("changePasswordController", () => {
    it("should return 401 when no session", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const result = await changePasswordController({
        currentPassword: "old",
        newPassword: "new123",
      });

      expect(result.status).toBe(401);
    });

    it("should return 400 when validation fails", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });

      const result = await changePasswordController({
        currentPassword: "old",
        newPassword: "123",
      });

      expect(result.status).toBe(400);
    });

    it("should return 200 on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });
      (changePassword as jest.Mock).mockResolvedValue(undefined);

      const result = await changePasswordController({
        currentPassword: "old",
        newPassword: "new123",
      });

      expect(result.status).toBe(200);
      expect(result.body.data.success).toBe(true);
    });

    it("should return 400 with error message when service throws", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user123" },
      });
      (changePassword as jest.Mock).mockRejectedValue(
        new Error("Senha atual incorreta")
      );

      const result = await changePasswordController({
        currentPassword: "wrong",
        newPassword: "new123",
      });

      expect(result.status).toBe(400);
      expect(result.body.error).toBe("Senha atual incorreta");
    });
  });
});
