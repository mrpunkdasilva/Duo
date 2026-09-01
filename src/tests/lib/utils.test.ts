import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      const result = cn("px-2", "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", false && "hidden", "extra");
      expect(result).toContain("base");
      expect(result).toContain("extra");
      expect(result).not.toContain("hidden");
    });

    it("should merge conflicting tailwind classes", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
    });
  });
});
