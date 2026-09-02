jest.mock(
  "@/app/(protected)/profile/utils/file-utils/file-utils.utils",
  () => ({
    isFileSizeValid: jest.fn(),
  })
);

import { renderHook, act } from "@testing-library/react";
import { useAvatarUpload } from "@/app/(protected)/profile/hooks/use-avatar-upload/use-avatar-upload.hook";
import { isFileSizeValid } from "@/app/(protected)/profile/utils/file-utils/file-utils.utils";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("useAvatarUpload", () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: "https://cloudinary.com/avatar.jpg" }),
    });
    (isFileSizeValid as jest.Mock).mockReturnValue(true);
  });

  it("should return fileInputRef, triggerFileInput, and handleFileChange", () => {
    const { result } = renderHook(() => useAvatarUpload({ onUpload: mockOnUpload }));
    expect(result.current.fileInputRef).toBeDefined();
    expect(typeof result.current.triggerFileInput).toBe("function");
    expect(typeof result.current.handleFileChange).toBe("function");
  });

  it("should call onUpload with url on successful upload", async () => {
    const { result } = renderHook(() => useAvatarUpload({ onUpload: mockOnUpload }));
    const file = new File(["test"], "avatar.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 1000 });

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockOnUpload).toHaveBeenCalledWith("https://cloudinary.com/avatar.jpg");
  });

  it("should not upload when file is too large", async () => {
    (isFileSizeValid as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useAvatarUpload({ onUpload: mockOnUpload }));
    const file = new File(["test"], "avatar.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 5 * 1024 * 1024 });

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it("should not upload when no file selected", async () => {
    const { result } = renderHook(() => useAvatarUpload({ onUpload: mockOnUpload }));

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: [] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should not call onUpload when upload response is not ok", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useAvatarUpload({ onUpload: mockOnUpload }));
    const file = new File(["test"], "avatar.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 1000 });

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockOnUpload).not.toHaveBeenCalled();
  });
});
