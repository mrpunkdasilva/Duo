import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StackProps {
  gap?: number;
  children: ReactNode;
  className?: string;
}

export function Stack({ gap = 4, children, className }: StackProps) {
  return (
    <div className={cn(`flex flex-col`, gap && `gap-${gap}`, className)}>
      {children}
    </div>
  );
}
