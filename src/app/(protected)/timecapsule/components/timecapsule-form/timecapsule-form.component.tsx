"use client";

import { useState } from "react";
import { Plus, X, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface TimeCapsuleFormProps {
  onSubmit: (data: {
    title: string;
    message: string;
    openAt: string;
    recipientId: string;
    recipientName: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function TimeCapsuleForm({ onSubmit }: TimeCapsuleFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [openAt, setOpenAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !openAt) return;

    setIsSubmitting(true);
    const result = await onSubmit({
      title,
      message,
      openAt,
      recipientId: "",
      recipientName: "",
    });

    if (result.success) {
      setTitle("");
      setMessage("");
      setOpenAt("");
      setIsOpen(false);
    }
    setIsSubmitting(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-duo-rose to-duo-teal text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Cápsula
      </Button>
    );
  }

  return (
    <Card className="ring-1 ring-foreground/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-duo-rose" />
            <h3 className="font-medium">Nova Cápsula do Tempo</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              placeholder="Ex: Nosso primeiro viagem juntos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem</label>
            <Textarea
              placeholder="Escreva uma mensagem para ser aberta no futuro..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de abertura
            </label>
            <Input
              type="date"
              value={openAt}
              onChange={(e) => setOpenAt(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !message || !openAt}
              className="flex-1 bg-gradient-to-r from-duo-rose to-duo-teal text-white"
            >
              {isSubmitting ? "Criando..." : "Criar Cápsula"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
