const mockFetch = jest.fn();
global.fetch = mockFetch;

import { renderHook, act } from "@testing-library/react";
import { useProfile } from "@/app/(protected)/profile/hooks/use-profile/use-profile.hook";

describe("useProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { bannerColor: "#ff0000" } }),
    });
  });

  it("should initialize in view mode", () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.mode).toBe("view");
  });

  it("should set mode to edit", () => {
    const { result } = renderHook(() => useProfile());
    act(() => result.current.setMode("edit"));
    expect(result.current.mode).toBe("edit");
  });

  it("should set mode to password", () => {
    const { result } = renderHook(() => useProfile());
    act(() => result.current.setMode("password"));
    expect(result.current.mode).toBe("password");
  });

  it("should reset mode to view via handleBack", () => {
    const { result } = renderHook(() => useProfile());
    act(() => result.current.setMode("edit"));
    expect(result.current.mode).toBe("edit");
    act(() => result.current.handleBack());
    expect(result.current.mode).toBe("view");
  });

  it("should load banner color from API", async () => {
    const { result } = renderHook(() => useProfile());
    await act(async () => {});
    expect(result.current.bannerColor).toBe("#ff0000");
  });

  it("should handle API error gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useProfile());
    await act(async () => {});
    expect(result.current.bannerColor).toBeNull();
  });

  it("should reload banner color when mode changes to view", async () => {
    const { result } = renderHook(() => useProfile());
    await act(async () => {});
    expect(result.current.bannerColor).toBe("#ff0000");

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { bannerColor: "#00ff00" } }),
    });

    act(() => result.current.setMode("edit"));
    act(() => result.current.handleBack());

    await act(async () => {});
    expect(result.current.bannerColor).toBe("#00ff00");
  });
});
