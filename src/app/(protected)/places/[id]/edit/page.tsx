"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlaceForm } from "@/components/features/place-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Place, UpdatePlaceInput } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("editPlace");
  const tc = useTranslations("common");
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPlace() {
      try {
        const response = await fetch(`/api/places?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setPlace(data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar lugar:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  const handleSubmit = async (data: UpdatePlaceInput) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar lugar");
      }

      router.push(`/places/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar lugar:", error);
      alert(t("error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-4 pt-4 max-w-lg mx-auto">
      <div className="mb-6">
        <Link href={`/places/${id}`}>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {tc("back")}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
        </div>
      ) : place ? (
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="p-4 md:p-6">
            <PlaceForm
              initialData={place}
              onSubmit={handleSubmit}
              isLoading={isSaving}
              onCancel={() => router.back()}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{t("notFound")}</p>
        </div>
      )}
    </div>
  );
}
