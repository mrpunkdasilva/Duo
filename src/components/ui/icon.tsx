import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IconProps {
  size?: "sm" | "md" | "lg";
  bg?: string;
  children: ReactNode;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function Icon({ size = "md", bg, children, className }: IconProps) {
  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center shrink-0",
        sizeMap[size],
        bg,
        className
      )}
    >
      {children}
    </div>
  );
}
