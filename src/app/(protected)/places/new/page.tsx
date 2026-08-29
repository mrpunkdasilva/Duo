"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlaceForm } from "@/components/features/place-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreatePlaceInput } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPlacePage() {
  const t = useTranslations("newPlace");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePlaceInput) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar lugar");
      }

      router.push("/places");
    } catch (error) {
      console.error("Erro ao criar lugar:", error);
      alert(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-4 max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/places">
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

      <Card className="border-0 shadow-sm bg-muted/30">
        <CardContent className="p-4 md:p-6">
          <PlaceForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
