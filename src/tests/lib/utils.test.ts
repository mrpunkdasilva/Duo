import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      // Arrange & Act
      const result = cn("px-2", "py-1");

      // Assert
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should handle conditional classes", () => {
      // Arrange & Act
      const result = cn("base", false && "hidden", "extra");

      // Assert
      expect(result).toContain("base");
      expect(result).toContain("extra");
      expect(result).not.toContain("hidden");
    });

    it("should merge conflicting tailwind classes", () => {
      // Arrange & Act
      const result = cn("px-2", "px-4");

      // Assert
      expect(result).toBe("px-4");
    });
  });
});
