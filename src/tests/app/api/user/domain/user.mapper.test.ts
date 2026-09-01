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
      expect(toUserData(mockUser as any).id).toBe("user123");
    });

    it("should map name and email", () => {
      const result = toUserData(mockUser as any);
      expect(result.name).toBe("Test User");
      expect(result.email).toBe("test@test.com");
    });

    it("should map image", () => {
      expect(toUserData(mockUser as any).image).toBe("http://image.jpg");
    });

    it("should map bannerColor", () => {
      expect(toUserData(mockUser as any).bannerColor).toBe("#ff0000");
    });

    it("should keep createdAt as Date", () => {
      expect(toUserData(mockUser as any).createdAt).toBeInstanceOf(Date);
    });

    it("should set image to null when image is falsy", () => {
      const user = { ...mockUser, image: "" };
      expect(toUserData(user as any).image).toBeNull();
    });

    it("should set bannerColor to null when bannerColor is falsy", () => {
      const user = { ...mockUser, bannerColor: "" };
      expect(toUserData(user as any).bannerColor).toBeNull();
    });
  });

  describe("toUserDataResponse", () => {
    it("should map _id to id string", () => {
      expect(toUserDataResponse(mockUser as any).id).toBe("user123");
    });

    it("should convert createdAt to ISO string", () => {
      const result = toUserDataResponse(mockUser as any);
      expect(typeof result.createdAt).toBe("string");
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should set image to null when image is falsy", () => {
      const user = { ...mockUser, image: "" };
      expect(toUserDataResponse(user as any).image).toBeNull();
    });

    it("should set bannerColor to null when bannerColor is falsy", () => {
      const user = { ...mockUser, bannerColor: "" };
      expect(toUserDataResponse(user as any).bannerColor).toBeNull();
    });
  });
});
