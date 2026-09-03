"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/heading";
import { Send, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/helpers";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  createdAt: Date;
}

interface MovieCommentsProps {
  movieId: number;
  currentUserId?: string;
  onAddComment?: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export function MovieComments({
  movieId,
  currentUserId,
  onAddComment,
  onDeleteComment,
}: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: currentUserId || "current-user",
        userName: "Você",
        text: newComment.trim(),
        createdAt: new Date(),
      };

      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      onAddComment?.(comment.text);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    onDeleteComment?.(commentId);
  };

  return (
    <div className="space-y-3">
      <Heading as="h2" variant="section">
        Comentários
      </Heading>

      <div className="flex gap-2 items-center">
        <Textarea
          placeholder="Deixe um comentário sobre o filme..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[40px] rounded-xl resize-none flex-1"
          maxLength={500}
        />
        <Button
          onClick={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          className="h-[40px] w-[40px] bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90 rounded-xl flex-shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum comentário ainda. Seja o primeiro!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.userImage} />
                    <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-xs font-bold">
                      {comment.userName?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                  {comment.userId === currentUserId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex-shrink-0 p-1 rounded hover:bg-red-50 transition-colors"
                      aria-label="Excluir comentário"
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
  );
}
