import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

interface BoxProps {
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
}

export function Box({ style, children, className }: BoxProps) {
  return (
    <div style={style} className={cn(className)}>
      {children}
    </div>
  );
}
