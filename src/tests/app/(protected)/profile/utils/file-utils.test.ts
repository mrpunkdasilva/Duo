import {
  isFileSizeValid,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "@/app/(protected)/profile/utils/file-utils/file-utils.utils";

describe("file-utils", () => {
  describe("MAX_FILE_SIZE", () => {
    it("should be 2MB", () => {
      expect(MAX_FILE_SIZE).toBe(2 * 1024 * 1024);
    });
  });

  describe("ACCEPTED_IMAGE_TYPES", () => {
    it("should accept image/*", () => {
      expect(ACCEPTED_IMAGE_TYPES).toBe("image/*");
    });
  });

  describe("isFileSizeValid", () => {
    it("should return true when size is below max", () => {
      expect(isFileSizeValid(1000)).toBe(true);
    });

    it("should return true when size equals max", () => {
      expect(isFileSizeValid(MAX_FILE_SIZE)).toBe(true);
    });

    it("should return false when size exceeds max", () => {
      expect(isFileSizeValid(MAX_FILE_SIZE + 1)).toBe(false);
    });

    it("should use custom max size when provided", () => {
      expect(isFileSizeValid(500, 1000)).toBe(true);
      expect(isFileSizeValid(1500, 1000)).toBe(false);
    });

    it("should return true for zero size", () => {
      expect(isFileSizeValid(0)).toBe(true);
    });
  });
});
