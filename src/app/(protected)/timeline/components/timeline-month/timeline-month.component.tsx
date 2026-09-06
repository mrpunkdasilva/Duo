import { Calendar } from "lucide-react";

interface TimelineMonthProps {
  label: string;
}

export function TimelineMonthHeader({ label }: TimelineMonthProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {label}
      </h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
