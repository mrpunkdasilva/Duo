import { Lock } from "lucide-react";

export default function TimeCapsuleLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <Lock className="h-12 w-12 text-duo-rose animate-pulse" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-duo-rose border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">Carregando cápsulas...</p>
    </div>
  );
}
