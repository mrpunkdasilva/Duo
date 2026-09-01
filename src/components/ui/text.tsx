import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TextElement = "p" | "span";

type TextVariant = "default" | "muted" | "small" | "error" | "success" | "label";

interface TextProps {
  as?: TextElement;
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  default: "text-sm",
  muted: "text-sm text-muted-foreground",
  small: "text-xs text-muted-foreground",
  error: "text-xs text-destructive",
  success: "text-xs text-green-600",
  label: "text-sm font-medium",
};

export function Text({
  as = "p",
  variant = "default",
  children,
  className,
}: TextProps) {
  const Component = as;

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
}
