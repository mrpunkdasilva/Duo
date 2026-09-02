jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      title: "Lugares",
      emptyAll: "Nenhum lugar salvo",
      savedCount: "{{count}} lugares salvos",
      searchPlaceholder: "Buscar lugares...",
      "tabs.all": "Todos",
      "tabs.pending": "Pendentes",
      "tabs.visited": "Visitados",
      emptySearch: "Nenhum lugar encontrado",
      emptyPending: "Nenhum lugar pendente",
      emptyVisited: "Nenhum lugar visitado",
      confirmDelete: "Excluir lugar",
    };
    if (params) {
      let result = translations[key] || key;
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
      });
      return result;
    }
    return translations[key] || key;
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("@/components/features/place-card", () => ({
  PlaceCard: (props: Record<string, unknown>) => {
    const place = props.place as { _id: { toString(): string }; name: string };
    return <div data-testid={`place-${place._id.toString()}`}>{place.name}</div>;
  },
}));

jest.mock("@/components/features/confirm-dialog", () => ({
  ConfirmDialog: () => null,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlacesPage from "@/app/(protected)/places/page";

describe("PlacesPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render empty state when no places", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    render(<PlacesPage />);
    await waitFor(() => {
      expect(screen.getByText("Nenhum lugar salvo")).toBeTruthy();
    });
  });

  it("should render places list", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            { _id: "1", name: "Cafe Central", visited: false, category: "restaurante" },
            { _id: "2", name: "Park View", visited: true, category: "parque" },
          ],
        }),
    });

    render(<PlacesPage />);
    await waitFor(() => {
      expect(screen.getByText("2 lugares salvos")).toBeTruthy();
      expect(screen.getByText("Cafe Central")).toBeTruthy();
      expect(screen.getByText("Park View")).toBeTruthy();
    });
  });

  it("should filter places by search", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            { _id: "1", name: "Cafe Central", visited: false, category: "restaurante" },
            { _id: "2", name: "Park View", visited: true, category: "parque" },
          ],
        }),
    });

    render(<PlacesPage />);
    await waitFor(() => {
      expect(screen.getByText("Cafe Central")).toBeTruthy();
    });

    fireEvent.change(screen.getByPlaceholderText("Buscar lugares..."), {
      target: { value: "Cafe" },
    });

    await waitFor(() => {
      expect(screen.getByText("Cafe Central")).toBeTruthy();
      expect(screen.queryByText("Park View")).toBeNull();
    });
  });

  it("should render manage categories link", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    render(<PlacesPage />);
    await waitFor(() => {
      expect(screen.getByText("Gerenciar Categorias")).toBeTruthy();
    });
  });
});
