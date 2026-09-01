import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function Link({ href, children, className }: LinkProps) {
  return (
    <a href={href} className={cn("block", className)}>
      {children}
    </a>
  );
}
