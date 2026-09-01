import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type FlexDirection = "row" | "col";

interface FlexProps {
  direction?: FlexDirection;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  gap?: number;
  children: ReactNode;
  className?: string;
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function Flex({
  direction,
  align,
  justify,
  wrap,
  gap = 4,
  children,
  className,
}: FlexProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" && "flex-col",
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && "flex-wrap",
        gap !== undefined && `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
}
