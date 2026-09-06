import { Lock } from "lucide-react";

export function TimeCapsuleEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nenhuma cápsula ainda</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Crie uma cápsula do tempo para seu parceiro e abram juntos em uma data
        especial!
      </p>
    </div>
  );
}
