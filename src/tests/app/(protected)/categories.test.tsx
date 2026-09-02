jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: "Categorias",
      subtitle: "Organize seus lugares por categoria",
      newCategory: "Nova categoria",
      empty: "Nenhuma categoria",
      emptyDescription: "Crie categorias para organizar seus lugares",
      editCategory: "Editar categoria",
      name: "Nome",
      namePlaceholder: "Nome da categoria",
      icon: "Ícone",
      color: "Cor",
      preview: "Pré-visualização",
      categoryPreview: "Categoria",
    };
    return translations[key] || key;
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/components/features/confirm-dialog", () => ({
  ConfirmDialog: ({ open, onConfirm, onOpenChange }: { open: boolean; onConfirm: () => void; onOpenChange: () => void }) =>
    open ? (
      <div data-testid="confirm-dialog">
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onOpenChange}>Cancelar</button>
      </div>
    ) : null,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoriesPage from "@/app/(protected)/categories/page";

describe("CategoriesPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render loading spinner", () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<CategoriesPage />);
    const svgLoader = document.querySelector("svg.animate-spin");
    expect(svgLoader).toBeTruthy();
  });

  it("should render empty state when no categories", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    render(<CategoriesPage />);
    await waitFor(() => {
      expect(screen.getByText("Nenhuma categoria")).toBeTruthy();
    });
  });

  it("should render categories list", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            { _id: "1", name: "Food", icon: "UtensilsCrossed", color: "from-orange-400 to-red-400" },
            { _id: "2", name: "Beach", icon: "Waves", color: "from-blue-400 to-cyan-400" },
          ],
        }),
    });

    render(<CategoriesPage />);
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeTruthy();
      expect(screen.getByText("Beach")).toBeTruthy();
    });
  });

  it("should open dialog when new category button clicked", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    render(<CategoriesPage />);
    await waitFor(() => {
      expect(screen.getByText("Nova categoria")).toBeTruthy();
    });
    fireEvent.click(screen.getByText("Nova categoria"));
    await waitFor(() => {
      expect(screen.getByText("Nome")).toBeTruthy();
    });
  });
});
