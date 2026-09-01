"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Place, Comment, PlaceRating, CATEGORY_LABELS, RATING_CATEGORIES, RATING_LABELS } from "@/types";
import {
  ArrowLeft,
  MapPin,
  Pencil,
  CheckCircle2,
  Loader2,
  Send,
  Trash2,
  UtensilsCrossed,
  Waves,
  Landmark,
  TreePine,
  Coffee,
  Wine,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/helpers";
import { StarRating } from "@/components/features/star-rating";

const categoryIcons: Record<string, React.ElementType> = {
  restaurante: UtensilsCrossed,
  praia: Waves,
  museu: Landmark,
  parque: TreePine,
  cafeteria: Coffee,
  bar: Wine,
  loja: ShoppingBag,
};

const categoryColors: Record<string, string[]> = {
  restaurante: ["#fb923c", "#f87171"],
  praia: ["#60a5fa", "#22d3ee"],
  museu: ["#a78bfa", "#818cf8"],
  parque: ["#4ade80", "#34d399"],
  cafeteria: ["#fbbf24", "#facc15"],
  bar: ["#f472b6", "#fb7185"],
  loja: ["#a78bfa", "#c084fc"],
};

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("placeDetail");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [rating, setRating] = useState<PlaceRating>({});
  const [isSavingRating, setIsSavingRating] = useState(false);

  useEffect(() => {
    async function loadPlace() {
      try {
        const response = await fetch(`/api/places?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setPlace(data.data);
          if (data.data.rating) {
            setRating(data.data.rating);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar lugar:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  useEffect(() => {
    async function loadComments() {
      try {
        const response = await fetch(`/api/comments?placeId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    }

    loadComments();
  }, [id]);

  const handleToggleVisited = async () => {
    if (!place) return;

    try {
      const response = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visited: !place.visited }),
      });

      if (response.ok) {
        setPlace((prev) => prev ? { ...prev, visited: !prev.visited } : prev);
      }
    } catch (error) {
      console.error("Erro ao atualizar lugar:", error);
    }
  };

  const handleRatingChange = async (category: keyof PlaceRating, value: number) => {
    const newRating = { ...rating, [category]: value };
    setRating(newRating);
    setIsSavingRating(true);

    try {
      const response = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rating: newRating }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlace(data.data);
      }
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
    } finally {
      setIsSavingRating(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: id, text: newComment.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data.data, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId }),
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c._id.toString() !== commentId));
      }
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  const CategoryIcon = place ? (categoryIcons[place.category] || MapPin) : MapPin;
  const colors = place ? (categoryColors[place.category] || ["#f43f5e", "#14b8a6"]) : ["#f43f5e", "#14b8a6"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="px-4 pt-4">
        <div className="text-center py-16">
          <p className="text-muted-foreground">{tc("notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 max-w-lg mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/places">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {tc("back")}
          </Button>
        </Link>
        <Link href={`/places/${id}/edit`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil className="h-3.5 w-3.5" />
            {tc("edit")}
          </Button>
        </Link>
      </div>

      <div
        className="h-2 rounded-full"
        style={{ background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})` }}
      />

      {place.photoUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden">
          <Image
            src={place.photoUrl}
            alt={place.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})` }}
        >
          <CategoryIcon className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Heading as="h1" variant="page" className="text-xl">{place.name}</Heading>
            {place.visited && (
              <Badge className="bg-duo-teal/10 text-duo-teal border-0 text-xs px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {t("visited")}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {CATEGORY_LABELS[place.category] || place.category}
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-muted/30">
        <CardContent className="p-4 space-y-4">
          {place.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("description")}</h3>
              <p className="text-sm">{place.description}</p>
            </div>
          )}

          {place.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("address")}</h3>
                <p className="text-sm">{place.address}</p>
              </div>
            </div>
          )}

          {place.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("notes")}</h3>
              <p className="text-sm">{place.notes}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("addedIn")}</h3>
            <p className="text-sm">{formatDate(place.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Rating section */}
      <Card className="border-0 shadow-sm bg-muted/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{t("rating")}</h3>
            {isSavingRating && (
              <span className="text-xs text-muted-foreground">{tc("saving")}</span>
            )}
          </div>
          <div className="space-y-2">
            {RATING_CATEGORIES.map((category) => (
              <StarRating
                key={category}
                value={rating[category]}
                onChange={(value) => handleRatingChange(category, value)}
                label={RATING_LABELS[category]}
                size="sm"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleToggleVisited}
        variant="outline"
        className={`w-full h-12 rounded-xl ${
          place.visited
            ? "border-duo-teal/30 text-duo-teal hover:bg-duo-teal/5"
            : "border-duo-rose/30 text-duo-rose hover:bg-duo-rose/5"
        }`}
      >
        <BookmarkIcon className="h-4 w-4 mr-2" filled={place.visited} />
        {place.visited ? t("markAsPending") : t("markAsVisited")}
      </Button>

      {/* Comments section */}
      <div className="space-y-3">
        <Heading as="h2" variant="section">{t("comments")}</Heading>

        <div className="flex gap-2 items-end">
          <Textarea
            placeholder={t("commentPlaceholder")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[40px] rounded-xl resize-none flex-1"
            maxLength={500}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmittingComment}
            className="h-[40px] w-[40px] bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90 rounded-xl flex-shrink-0"
          >
            {isSubmittingComment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("noComments")}
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment._id.toString()} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.userId?.image || ""} />
                      <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-xs font-bold">
                        {comment.userId?.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{comment.userId?.name || "Você"}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
                    </div>
                    {comment.userId?._id?.toString() === (session?.user as any)?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id.toString())}
                        className="flex-shrink-0 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarkIcon({ className, filled }: { className?: string; filled: boolean }) {
  if (filled) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
