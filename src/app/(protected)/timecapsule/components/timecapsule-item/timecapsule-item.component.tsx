"use client";

import { Lock, Unlock, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TimeCapsule } from "../../types/timecapsule.types";

interface TimeCapsuleItemProps {
  capsule: TimeCapsule;
  onOpen?: (id: string) => void;
}

export function TimeCapsuleItem({ capsule, onOpen }: TimeCapsuleItemProps) {
  const now = new Date();
  const openAt = new Date(capsule.openAt);
  const isOpened = capsule.isOpened;
  const isReady = now >= openAt && !isOpened;

  const formattedOpenAt = openAt.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedCreatedAt = new Date(capsule.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const daysUntilOpen = Math.ceil(
    (openAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleOpen = () => {
    if (isReady && onOpen) {
      onOpen(capsule.id);
    }
  };

  return (
    <Card
      className={`ring-1 transition-all ${
        isReady
          ? "ring-duo-teal/50 hover:ring-duo-teal hover:shadow-md cursor-pointer"
          : isOpened
          ? "ring-foreground/10"
          : "ring-foreground/10 opacity-80"
      }`}
      onClick={handleOpen}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isOpened
                ? "bg-duo-teal/10"
                : isReady
                ? "bg-duo-rose/10"
                : "bg-muted"
            }`}
          >
            {isOpened ? (
              <Unlock className="h-5 w-5 text-duo-teal" />
            ) : isReady ? (
              <Heart className="h-5 w-5 text-duo-rose" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{capsule.title}</h3>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  isOpened
                    ? "bg-duo-teal/10 text-duo-teal"
                    : isReady
                    ? "bg-duo-rose/10 text-duo-rose"
                    : ""
                }`}
              >
                {isOpened ? "Aberta" : isReady ? "Pronta!" : "Selada"}
              </Badge>
            </div>

            {isOpened ? (
              <p className="text-sm text-foreground mt-1">{capsule.message}</p>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>
                  {isReady
                    ? "Pronta para abrir!"
                    : `Abre em ${daysUntilOpen} dia${daysUntilOpen !== 1 ? "s" : ""}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>De: {capsule.senderName}</span>
              <span>Para: {capsule.recipientName}</span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>Criada: {formattedCreatedAt}</span>
              {!isOpened && <span>Abre: {formattedOpenAt}</span>}
            </div>
          </div>

          {isReady && (
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-duo-rose text-duo-rose hover:bg-duo-rose/10"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
            >
              Abrir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
