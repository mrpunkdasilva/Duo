jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: "John", email: "john@test.com", image: "img.jpg" } },
  })),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      forYouTwo: "Para vocês dois",
      greeting: "Olá {{name}}",
      emptyState: "Nenhum lugar ainda",
      placesToExplore: "{{count}} lugares para explorar",
      "stats.places": "Lugares",
      "stats.visited": "Visitados",
      "stats.pending": "Pendentes",
      connectDuo: "Conectar ao duo",
      connectDuoDescription: "Compartilhe um código com seu parceiro",
      addFirstPlace: "Adicionar primeiro lugar",
      addFirstPlaceDescription: "Comece a salvar lugares juntos",
      recent: "Recentes",
      seeAll: "Ver todos",
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

jest.mock("@/components/features/place-list", () => ({
  PlaceList: (props: Record<string, unknown>) => (
    <div data-testid="place-list" data-count={Array.isArray(props.places) ? props.places.length : 0} />
  ),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/(protected)/home/page";

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockImplementation((url: string) => {
      if (url === "/api/stats") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: { totalPlaces: 5, visitedPlaces: 2, pendingPlaces: 3, categoryBreakdown: {}, recentPlaces: [] },
            }),
        });
      }
      if (url === "/api/places?limit=5") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: [
                { _id: "1", name: "Cafe Central", visited: false, category: "restaurante" },
                { _id: "2", name: "Park View", visited: true, category: "parque" },
              ],
            }),
        });
      }
      if (url === "/api/couple") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { partner: { name: "Jane" } } }),
        });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
  });

  it("should render dashboard with partner info", async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/John/)).toBeTruthy();
    });
  });

  it("should display stats when available", async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("5")).toBeTruthy();
      expect(screen.getByText("2")).toBeTruthy();
      expect(screen.getByText("3")).toBeTruthy();
    });
  });

  it("should show partner connection prompt when no partner", async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url === "/api/couple") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: null }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) });
    });

    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("Conectar ao duo")).toBeTruthy();
    });
  });

  it("should render add place link", async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("Adicionar primeiro lugar")).toBeTruthy();
    });
  });

  it("should render place list", async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByTestId("place-list")).toBeTruthy();
    });
  });
});
