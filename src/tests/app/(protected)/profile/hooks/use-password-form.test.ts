jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      currentPasswordRequired: "Senha atual obrigatória",
      passwordMinLength: "Senha deve ter pelo menos 6 caracteres",
      passwordMismatch: "Senhas não conferem",
      error: "Erro ao alterar senha",
    };
    return translations[key] || key;
  }),
}));

import { renderHook, act } from "@testing-library/react";
import { usePasswordForm } from "@/app/(protected)/profile/hooks/use-password-form/use-password-form.hook";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("usePasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
  });

  it("should initialize with empty values", () => {
    const { result } = renderHook(() => usePasswordForm());
    expect(result.current.currentPassword).toBe("");
    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.isFormValid).toBe(false);
  });

  it("should validate form correctly", () => {
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setCurrentPassword("old123"));
    act(() => result.current.setNewPassword("newpass"));
    act(() => result.current.setConfirmPassword("newpass"));
    expect(result.current.isFormValid).toBe(true);
  });

  it("should show error when current password is empty", async () => {
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setNewPassword("newpass"));
    act(() => result.current.setConfirmPassword("newpass"));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Senha atual obrigatória");
  });

  it("should show error when new password is too short", async () => {
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setCurrentPassword("old123"));
    act(() => result.current.setNewPassword("12345"));
    act(() => result.current.setConfirmPassword("12345"));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Senha deve ter pelo menos 6 caracteres");
  });

  it("should show error when passwords do not match", async () => {
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setCurrentPassword("old123"));
    act(() => result.current.setNewPassword("newpass"));
    act(() => result.current.setConfirmPassword("different"));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Senhas não conferem");
  });

  it("should call fetch and show success on valid submit", async () => {
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setCurrentPassword("old123"));
    act(() => result.current.setNewPassword("newpass"));
    act(() => result.current.setConfirmPassword("newpass"));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(mockFetch).toHaveBeenCalledWith("/api/user", expect.objectContaining({ method: "PATCH" }));
    expect(result.current.success).toBe(true);
  });

  it("should handle API error", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: "Wrong password" }) });
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setCurrentPassword("old123"));
    act(() => result.current.setNewPassword("newpass"));
    act(() => result.current.setConfirmPassword("newpass"));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Wrong password");
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => usePasswordForm());
    act(() => result.current.setCurrentPassword("old123"));
    act(() => result.current.setNewPassword("newpass"));
    act(() => result.current.setConfirmPassword("newpass"));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Erro ao alterar senha");
  });
});
