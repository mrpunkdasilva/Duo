jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: "Conectar Duo",
      subtitle: "Compartilhe um código com seu parceiro(a)",
      connected: "Conectado(a) a",
      shareCode: "Compartilhar código",
      shareCodeDescription: "Envie este código para seu parceiro",
      generateCode: "Gerar código",
      enterCode: "Entrar com código",
      enterCodeDescription: "Insira o código do seu parceiro",
      link: "Vincular",
      invalidCode: "Código inválido",
      linkError: "Erro ao vincular",
      linkedSuccess: "Parceiro vinculado com sucesso!",
      howItWorks: "Como funciona",
      step1: "Gere um código e compartilhe",
      step2: "Seu parceiro insere o código",
      step3: "Pronto! Vocês estão conectados",
    };
    return translations[key] || key;
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PartnerPage from "@/app/(protected)/partner/page";

describe("PartnerPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render loading spinner", () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<PartnerPage />);
    const svgLoader = document.querySelector("svg.animate-spin");
    expect(svgLoader).toBeTruthy();
  });

  it("should render with invite code", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { inviteCode: "ABC123" } }),
    });

    render(<PartnerPage />);
    await waitFor(() => {
      expect(screen.getByText("ABC123")).toBeTruthy();
    });
  });

  it("should render partner info when already connected", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { inviteCode: "ABC123", partner: { name: "Jane", image: "jane.jpg" } },
        }),
    });

    render(<PartnerPage />);
    await waitFor(() => {
      expect(screen.getByText("Jane")).toBeTruthy();
      expect(screen.getByText("Conectado(a) a")).toBeTruthy();
    });
  });

  it("should show invite code form when no partner", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { inviteCode: "ABC123" } }),
    });

    render(<PartnerPage />);
    await waitFor(() => {
      expect(screen.getByText("Compartilhar código")).toBeTruthy();
      expect(screen.getByText("Entrar com código")).toBeTruthy();
    });
  });

  it("should generate code when button clicked", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: null }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { inviteCode: "XYZ789" } }) });

    render(<PartnerPage />);
    await waitFor(() => {
      expect(screen.getByText("Gerar código")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("Gerar código"));
    await waitFor(() => {
      expect(screen.getByText("XYZ789")).toBeTruthy();
    });
  });

  it("should link partner with valid code", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { inviteCode: "ABC123" } }),
    });

    render(<PartnerPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText("ABCDEF")).toBeTruthy();
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { partnerName: "Jane" } }),
    });

    fireEvent.change(screen.getByPlaceholderText("ABCDEF"), { target: { value: "ABC123" } });
    fireEvent.click(screen.getByText("Vincular"));

    await waitFor(() => {
      expect(screen.getByText("Jane")).toBeTruthy();
    });
  });

  it("should render how it works steps", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: null }),
    });

    render(<PartnerPage />);
    await waitFor(() => {
      expect(screen.getByText("Como funciona")).toBeTruthy();
      expect(screen.getByText("Gere um código e compartilhe")).toBeTruthy();
    });
  });
});
