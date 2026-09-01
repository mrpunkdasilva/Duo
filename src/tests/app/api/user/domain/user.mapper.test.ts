import { toUserData, toUserDataResponse } from "@/app/api/user/infra/mappers/user.mapper";

describe("user.mapper", () => {
  const mockUser = {
    _id: { toString: () => "user123" },
    name: "Test User",
    email: "test@test.com",
    image: "http://image.jpg",
    bannerColor: "#ff0000",
    createdAt: new Date("2024-01-15T00:00:00"),
  };

  describe("toUserData", () => {
    it("should map _id to id string", () => {
      // Arrange & Act
      const result = toUserData(mockUser as any);

      // Assert
      expect(result.id).toBe("user123");
    });

    it("should map name and email", () => {
      // Arrange & Act
      const result = toUserData(mockUser as any);

      // Assert
      expect(result.name).toBe("Test User");
      expect(result.email).toBe("test@test.com");
    });

    it("should map image", () => {
      // Arrange & Act
      const result = toUserData(mockUser as any);

      // Assert
      expect(result.image).toBe("http://image.jpg");
    });

    it("should map bannerColor", () => {
      // Arrange & Act
      const result = toUserData(mockUser as any);

      // Assert
      expect(result.bannerColor).toBe("#ff0000");
    });

    it("should keep createdAt as Date", () => {
      // Arrange & Act
      const result = toUserData(mockUser as any);

      // Assert
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it("should set image to null when image is falsy", () => {
      // Arrange
      const userWithoutImage = { ...mockUser, image: "" };

      // Act
      const result = toUserData(userWithoutImage as any);

      // Assert
      expect(result.image).toBeNull();
    });

    it("should set bannerColor to null when bannerColor is falsy", () => {
      // Arrange
      const userWithoutBanner = { ...mockUser, bannerColor: "" };

      // Act
      const result = toUserData(userWithoutBanner as any);

      // Assert
      expect(result.bannerColor).toBeNull();
    });
  });

  describe("toUserDataResponse", () => {
    it("should map _id to id string", () => {
      // Arrange & Act
      const result = toUserDataResponse(mockUser as any);

      // Assert
      expect(result.id).toBe("user123");
    });

    it("should convert createdAt to ISO string", () => {
      // Arrange & Act
      const result = toUserDataResponse(mockUser as any);

      // Assert
      expect(typeof result.createdAt).toBe("string");
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should set image to null when image is falsy", () => {
      // Arrange
      const userWithoutImage = { ...mockUser, image: "" };

      // Act
      const result = toUserDataResponse(userWithoutImage as any);

      // Assert
      expect(result.image).toBeNull();
    });

    it("should set bannerColor to null when bannerColor is falsy", () => {
      // Arrange
      const userWithoutBanner = { ...mockUser, bannerColor: "" };

      // Act
      const result = toUserDataResponse(userWithoutBanner as any);

      // Assert
      expect(result.bannerColor).toBeNull();
    });
  });
});
