"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { PlaceForm } from "@/components/features/place-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePlaceInput } from "@/specs/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPlacePage() {
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
      alert("Erro ao criar lugar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/places">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Novo Lugar</h1>
          <p className="text-muted-foreground mt-1">
            Adicione um novo lugar para visitar com seu par
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <PlaceForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onCancel={() => router.back()}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
