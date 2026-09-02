jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      description: "Crie sua conta",
      title: "Criar conta",
      name: "Nome",
      namePlaceholder: "Seu nome",
      email: "Email",
      emailPlaceholder: "seu@email.com",
      password: "Senha",
      passwordPlaceholder: "••••••••",
      submit: "Criar conta",
      hasAccount: "Já tem conta?",
      login: "Entrar",
      passwordMin: "A senha deve ter pelo menos 6 caracteres",
      createError: "Erro ao criar conta",
    };
    return translations[key] || key;
  }),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";
import { signIn } from "next-auth/react";

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("should render register form elements", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /criar conta/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /entrar/i })).toBeTruthy();
    expect(screen.getByLabelText("Nome")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Senha")).toBeTruthy();
  });

  it("should show error when password is too short", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345" } });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText("A senha deve ter pelo menos 6 caracteres")).toBeTruthy();
    });
  });

  it("should show error on failed registration", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Email already exists" }),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeTruthy();
    });
  });

  it("should call signIn and redirect on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@test.com",
        password: "123456",
        redirect: false,
      });
    });
  });
});
