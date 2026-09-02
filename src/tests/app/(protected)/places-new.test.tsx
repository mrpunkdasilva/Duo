jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: "Novo lugar",
      subtitle: "Adicione um novo lugar para visitar",
      error: "Erro ao criar lugar",
    };
    return translations[key] || key;
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("@/components/features/place-form", () => ({
  PlaceForm: (props: Record<string, unknown>) => {
    const onSubmit = props.onSubmit as (data: unknown) => void;
    const isLoading = props.isLoading as boolean;
    return (
      <div data-testid="place-form">
        <button
          onClick={() =>
            onSubmit({
              name: "New Place",
              description: "Test",
              category: "restaurante",
              address: "123 Main St",
              latitude: 0,
              longitude: 0,
              photoUrl: "",
              notes: "",
            })
          }
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Enviar"}
        </button>
      </div>
    );
  },
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewPlacePage from "@/app/(protected)/places/new/page";

describe("NewPlacePage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render page heading", () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    render(<NewPlacePage />);
    expect(screen.getByText("Novo lugar")).toBeTruthy();
  });

  it("should render place form", () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    render(<NewPlacePage />);
    expect(screen.getByTestId("place-form")).toBeTruthy();
  });

  it("should submit form and redirect", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { _id: "new1" } }) });

    render(<NewPlacePage />);
    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/places");
    });
  });
});
