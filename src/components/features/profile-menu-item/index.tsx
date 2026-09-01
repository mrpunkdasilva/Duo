"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ProfileMenuItemProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

export function ProfileMenuItem({
  icon,
  iconBg,
  label,
  description,
  onClick,
  href,
}: ProfileMenuItemProps) {
  const content = (
    <Card className="border-0 shadow-sm hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="flex items-center gap-4 py-4 px-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}
