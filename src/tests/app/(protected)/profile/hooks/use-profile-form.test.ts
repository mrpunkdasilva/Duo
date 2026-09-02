jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: "John",
        email: "john@test.com",
        image: "img.jpg",
      },
    },
    update: jest.fn(),
  })),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      nameRequired: "Nome obrigatório",
      emailRequired: "Email obrigatório",
      error: "Erro ao salvar",
    };
    return translations[key] || key;
  }),
}));

import { renderHook, act } from "@testing-library/react";
import { useProfileForm } from "@/app/(protected)/profile/hooks/use-profile-form/use-profile-form.hook";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("useProfileForm", () => {
  const mockOnSaved = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
  });

  it("should initialize with session values", () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    expect(result.current.name).toBe("John");
    expect(result.current.email).toBe("john@test.com");
    expect(result.current.image).toBe("img.jpg");
  });

  it("should validate form correctly", () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    expect(result.current.isFormValid).toBe(true);
  });

  it("should set name", () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    act(() => result.current.setName("Jane"));
    expect(result.current.name).toBe("Jane");
  });

  it("should set email", () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    act(() => result.current.setEmail("jane@test.com"));
    expect(result.current.email).toBe("jane@test.com");
  });

  it("should set image", () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    act(() => result.current.setImage("new-img.jpg"));
    expect(result.current.image).toBe("new-img.jpg");
  });

  it("should set bannerColor", () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    act(() => result.current.setBannerColor("#ff0000"));
    expect(result.current.bannerColor).toBe("#ff0000");
  });

  it("should show error when name is empty on save", async () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    act(() => result.current.setName(""));
    await act(async () => {
      await result.current.handleSave({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Nome obrigatório");
  });

  it("should show error when email has no @ on save", async () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    act(() => result.current.setEmail("invalid"));
    await act(async () => {
      await result.current.handleSave({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Email obrigatório");
  });

  it("should call fetch and onSaved on successful save", async () => {
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    await act(async () => {
      await result.current.handleSave({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(mockFetch).toHaveBeenCalledWith("/api/user", expect.objectContaining({ method: "PUT" }));
    expect(mockOnSaved).toHaveBeenCalled();
  });

  it("should handle API error", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: "Server error" }) });
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    await act(async () => {
      await result.current.handleSave({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Server error");
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useProfileForm({ onSaved: mockOnSaved }));
    await act(async () => {
      await result.current.handleSave({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Erro ao salvar");
  });
});
