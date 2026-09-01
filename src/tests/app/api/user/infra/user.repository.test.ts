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
      // Arrange
      mockSelect.mockResolvedValue(null);

      // Act
      await findUserById("user123");

      // Assert
      expect(connectToDatabase).toHaveBeenCalled();
    });

    it("should call findById with userId", async () => {
      // Arrange
      mockSelect.mockResolvedValue(null);

      // Act
      await findUserById("user123");

      // Assert
      expect(mockFindById).toHaveBeenCalledWith("user123");
    });

    it("should select USER_FIELDS", async () => {
      // Arrange
      mockSelect.mockResolvedValue(null);

      // Act
      await findUserById("user123");

      // Assert
      expect(mockSelect).toHaveBeenCalledWith("name email image bannerColor createdAt");
    });
  });

  describe("findUserByIdWithPassword", () => {
    it("should select +password", async () => {
      // Arrange
      mockSelect.mockResolvedValue(null);

      // Act
      await findUserByIdWithPassword("user123");

      // Assert
      expect(mockSelect).toHaveBeenCalledWith("+password");
    });
  });

  describe("findUserByEmail", () => {
    it("should call findOne with email query", async () => {
      // Arrange
      mockFindOne.mockResolvedValue(null);

      // Act
      await findUserByEmail("test@test.com");

      // Assert
      expect(mockFindOne).toHaveBeenCalledWith({ email: "test@test.com" });
    });

    it("should add $ne filter when excludeId is provided", async () => {
      // Arrange
      mockFindOne.mockResolvedValue(null);

      // Act
      await findUserByEmail("test@test.com", "exclude123");

      // Assert
      expect(mockFindOne).toHaveBeenCalledWith({
        email: "test@test.com",
        _id: { $ne: "exclude123" },
      });
    });
  });

  describe("saveUser", () => {
    it("should call user.save()", async () => {
      // Arrange
      const mockUser = {
        _id: "user123",
        save: mockSave.mockResolvedValue(undefined),
      };

      // Act
      await saveUser(mockUser as any);

      // Assert
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
