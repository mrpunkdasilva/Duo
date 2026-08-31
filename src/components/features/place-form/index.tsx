"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CreatePlaceInput, PLACE_CATEGORIES, CATEGORY_LABELS, Category } from "@/types";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

interface PlaceFormProps {
  initialData?: Partial<CreatePlaceInput>;
  onSubmit: (data: CreatePlaceInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function PlaceForm({ initialData, onSubmit, isLoading, onCancel }: PlaceFormProps) {
  const t = useTranslations("placeForm");
  const tc = useTranslations("common");
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<string>(initialData?.category || "restaurante");
  const [address, setAddress] = useState(initialData?.address || "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCustomCategories(data.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    loadCategories();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("nameRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category as CreatePlaceInput["category"],
      address: address.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">{t("name")}</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-xl"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">{t("description")}</Label>
        <Textarea
          id="description"
          placeholder={t("descriptionPlaceholder")}
          className="resize-none rounded-xl min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("category")}</Label>
        <Select value={category} onValueChange={(v) => v && setCategory(v)}>
          <SelectTrigger className="h-12 rounded-xl w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLACE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
            {customCategories.map((cat) => (
              <SelectItem key={cat._id.toString()} value={cat.name.toLowerCase()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Link href="/categories" className="inline-flex items-center gap-1 text-xs text-duo-rose hover:underline mt-1">
          <Plus className="h-3 w-3" />
          {tc("newCategory")}
        </Link>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">{t("address")}</Label>
        <Input
          id="address"
          placeholder={t("addressPlaceholder")}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photoUrl" className="text-sm font-medium">{t("photoUrl")}</Label>
        <Input
          id="photoUrl"
          placeholder={t("photoUrlPlaceholder")}
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">{t("notes")}</Label>
        <Textarea
          id="notes"
          placeholder={t("notesPlaceholder")}
          className="resize-none rounded-xl min-h-[80px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={onCancel}>
            {tc("cancel")}
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {tc("saving")}
            </>
          ) : (
            tc("save")
          )}
        </Button>
      </div>
    </form>
  );
}
