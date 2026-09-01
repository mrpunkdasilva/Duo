jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSelect = jest.fn();
const mockFindById = jest.fn();
const mockFindOne = jest.fn();
const mockSave = jest.fn();

jest.mock("@/models/user", () => {
  return {
    __esModule: true,
    default: {
      findById: (...args: unknown[]) => {
        mockFindById(...args);
        return { select: mockSelect };
      },
      findOne: (...args: unknown[]) => mockFindOne(...args),
    },
  };
});

import {
  findUserById,
  findUserByIdWithPassword,
  findUserByEmail,
  saveUser,
} from "@/app/api/user/infra/repositories/user.repository";
import { connectToDatabase } from "@/lib/mongodb";

describe("user.repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserById", () => {
    it("should call connectToDatabase before query", async () => {
      mockSelect.mockResolvedValue(null);
      await findUserById("user123");
      expect(connectToDatabase).toHaveBeenCalled();
    });

    it("should call findById with userId", async () => {
      mockSelect.mockResolvedValue(null);
      await findUserById("user123");
      expect(mockFindById).toHaveBeenCalledWith("user123");
    });

    it("should select USER_FIELDS", async () => {
      mockSelect.mockResolvedValue(null);
      await findUserById("user123");
      expect(mockSelect).toHaveBeenCalledWith("name email image bannerColor createdAt");
    });
  });

  describe("findUserByIdWithPassword", () => {
    it("should select +password", async () => {
      mockSelect.mockResolvedValue(null);
      await findUserByIdWithPassword("user123");
      expect(mockSelect).toHaveBeenCalledWith("+password");
    });
  });

  describe("findUserByEmail", () => {
    it("should call findOne with email query", async () => {
      mockFindOne.mockResolvedValue(null);
      await findUserByEmail("test@test.com");
      expect(mockFindOne).toHaveBeenCalledWith({ email: "test@test.com" });
    });

    it("should add $ne filter when excludeId is provided", async () => {
      mockFindOne.mockResolvedValue(null);
      await findUserByEmail("test@test.com", "exclude123");
      expect(mockFindOne).toHaveBeenCalledWith({
        email: "test@test.com",
        _id: { $ne: "exclude123" },
      });
    });
  });

  describe("saveUser", () => {
    it("should call user.save()", async () => {
      const mockUser = {
        _id: "user123",
        save: mockSave.mockResolvedValue(undefined),
      };
      await saveUser(mockUser as any);
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
