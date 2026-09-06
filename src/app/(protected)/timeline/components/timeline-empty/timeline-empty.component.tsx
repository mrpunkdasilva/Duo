import { Clock } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function TimelineEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-muted-foreground" />
      </div>
      <Heading variant="section">Nenhuma memória ainda</Heading>
      <Text variant="muted" className="mt-1 max-w-xs">
        Visite lugares e assistam filmes juntos para criar sua linha do tempo
      </Text>
    </div>
  );
}
