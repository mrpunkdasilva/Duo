import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type HeadingVariant = "page" | "section" | "subsection" | "card" | "label";

interface HeadingProps {
  as?: HeadingLevel;
  variant?: HeadingVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<HeadingVariant, string> = {
  page: "text-2xl md:text-3xl font-bold tracking-tight",
  section: "font-semibold text-lg",
  subsection: "font-semibold text-sm",
  card: "font-medium text-sm",
  label: "text-sm font-medium text-muted-foreground",
};

const defaultElement: Record<HeadingVariant, HeadingLevel> = {
  page: "h1",
  section: "h2",
  subsection: "h3",
  card: "h3",
  label: "h3",
};

export function Heading({
  as,
  variant = "page",
  children,
  className,
}: HeadingProps) {
  const Component = as || defaultElement[variant];

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
}
