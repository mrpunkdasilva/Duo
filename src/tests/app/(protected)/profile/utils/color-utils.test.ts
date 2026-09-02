import { colorFromGradient } from "@/app/(protected)/profile/utils/color-utils/color-utils.utils";

describe("color-utils", () => {
  describe("colorFromGradient", () => {
    it("should extract hex color from gradient string", () => {
      expect(colorFromGradient("linear-gradient(to right, #ff0000, #0000ff)")).toBe("#ff0000");
    });

    it("should return first hex color when multiple exist", () => {
      expect(colorFromGradient("#112233 #445566")).toBe("#112233");
    });

    it("should return default color when no hex found", () => {
      expect(colorFromGradient("no color here")).toBe("#f43f5e");
    });

    it("should handle empty string", () => {
      expect(colorFromGradient("")).toBe("#f43f5e");
    });

    it("should handle uppercase hex", () => {
      expect(colorFromGradient("from #FF00FF to #00FF00")).toBe("#FF00FF");
    });

    it("should handle mixed case hex", () => {
      expect(colorFromGradient("#aAbBcC")).toBe("#aAbBcC");
    });
  });
});
