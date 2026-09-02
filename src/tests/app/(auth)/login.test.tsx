jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      description: "Entre na sua conta",
      title: "Entrar",
      email: "Email",
      emailPlaceholder: "seu@email.com",
      password: "Senha",
      passwordPlaceholder: "••••••••",
      submit: "Entrar",
      noAccount: "Não tem conta?",
      createAccount: "Criar conta",
      invalidCredentials: "Email ou senha inválidos",
      loginError: "Erro ao fazer login",
    };
    return translations[key] || key;
  }),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { signIn } from "next-auth/react";

describe("LoginPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render login form elements", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /entrar/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /criar conta/i })).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Senha")).toBeTruthy();
  });

  it("should show error on invalid credentials", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "CredentialsSignin" });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Email ou senha inválidos")).toBeTruthy();
    });
  });

  it("should redirect on successful login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });
});
