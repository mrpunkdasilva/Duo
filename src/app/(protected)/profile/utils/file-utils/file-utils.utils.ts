export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = "image/*";

export function isFileSizeValid(size: number, maxSize: number = MAX_FILE_SIZE): boolean {
  return size <= maxSize;
}
