"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/heading";
import { Send, Trash2 } from "lucide-react";

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

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    userId: "user-1",
    userName: "Ana",
    userImage: "",
    text: "Esse filme é incrível! Já assisti 3 vezes e choro toda vez 😭",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    userId: "user-2",
    userName: "Pedro",
    userImage: "",
    text: "A melhor parte é quando ele volta no tempo e encontra a filha. Cena perfeita!",
    createdAt: new Date("2024-01-16"),
  },
];

export function MovieComments({
  movieId,
  currentUserId,
  onAddComment,
  onDeleteComment,
}: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUserId || "current-user",
      userName: "Você",
      text: newComment.trim(),
      createdAt: new Date(),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
    onAddComment?.(comment.text);
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    onDeleteComment?.(commentId);
  };

  return (
    <div className="space-y-4">
      <Heading as="h2" variant="section">
        Comentários ({comments.length})
      </Heading>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-3 rounded-xl bg-muted/50"
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.userImage} alt={comment.userName} />
              <AvatarFallback className="bg-duo-rose/10 text-duo-rose text-xs font-bold">
                {comment.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {comment.createdAt.toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {comment.text}
              </p>
            </div>

            {comment.userId === currentUserId && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Excluir comentário"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Textarea
          placeholder="Deixe um comentário sobre o filme..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] rounded-xl resize-none"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!newComment.trim()}
        className="w-full bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
      >
        <Send className="h-4 w-4 mr-2" />
        Enviar Comentário
      </Button>
    </div>
  );
}
