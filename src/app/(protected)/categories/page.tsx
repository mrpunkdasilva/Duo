"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Category } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  UtensilsCrossed,
  Waves,
  Landmark,
  TreePine,
  Coffee,
  Wine,
  ShoppingBag,
  MapPin,
  Tag,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Waves,
  Landmark,
  TreePine,
  Coffee,
  Wine,
  ShoppingBag,
  MapPin,
};

const iconOptions = [
  { value: "UtensilsCrossed", label: "Restaurante" },
  { value: "Waves", label: "Praia" },
  { value: "Landmark", label: "Museu" },
  { value: "TreePine", label: "Parque" },
  { value: "Coffee", label: "Café" },
  { value: "Wine", label: "Bar" },
  { value: "ShoppingBag", label: "Loja" },
  { value: "MapPin", label: "Outro" },
];

const colorOptions = [
  "from-orange-400 to-red-400",
  "from-blue-400 to-cyan-400",
  "from-purple-400 to-indigo-400",
  "from-green-400 to-emerald-400",
  "from-amber-400 to-yellow-400",
  "from-pink-400 to-rose-400",
  "from-violet-400 to-purple-400",
  "from-duo-rose to-duo-teal",
];

function IconRenderer({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || MapPin;
  return <Icon className={className} />;
}

export default function CategoriesPage() {
  const t = useTranslations("categories");
  const tc = useTranslations("common");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("MapPin");
  const [selectedColor, setSelectedColor] = useState("from-duo-rose to-duo-teal");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSelectedIcon(category.icon || "MapPin");
      setSelectedColor(category.color || "from-duo-rose to-duo-teal");
    } else {
      setEditingCategory(null);
      setName("");
      setSelectedIcon("MapPin");
      setSelectedColor("from-duo-rose to-duo-teal");
    }
    setError("");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const url = "/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory
        ? { id: editingCategory._id, name: name.trim(), icon: selectedIcon, color: selectedColor }
        : { name: name.trim(), icon: selectedIcon, color: selectedColor };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao salvar categoria");
        return;
      }

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? data.data : c))
        );
      } else {
        setCategories((prev) => [...prev, data.data]);
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setError("Erro ao salvar categoria");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("newCategory")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">{t("empty")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => {
            const colorClass = category.color || "from-duo-rose to-duo-teal";

            return (
              <Card key={category._id.toString()} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                    <IconRenderer name={category.icon || "MapPin"} className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{category.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category._id.toString())}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t("editCategory") : t("newCategory")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="h-12 rounded-xl"
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("icon")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedIcon(option.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                      selectedIcon === option.value
                        ? "border-duo-rose bg-duo-rose/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <IconRenderer name={option.value} className="h-5 w-5" />
                    <span className="text-[10px] text-muted-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("color")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 rounded-lg bg-gradient-to-r ${color} transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-duo-rose"
                        : "hover:opacity-80"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("preview")}</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedColor} flex items-center justify-center`}>
                  <IconRenderer name={selectedIcon} className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">{name || t("categoryPreview")}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl"
            >
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90 rounded-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tc("saving")}
                </>
              ) : (
                tc("save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
