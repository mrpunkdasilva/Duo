"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Flex } from "@/components/ui/flex";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
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
    <Card className="w-full border-0 shadow-sm ring-0 hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="py-4 px-4">
        <Flex align="center" gap={3}>
          
          <Icon bg={iconBg}>{icon}</Icon>

          <Flex direction="col" className="flex-1">
            <Text variant="label">{label}</Text>
            <Text variant="small">{description}</Text>
          </Flex>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Flex>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full !items-start text-left p-0 h-auto justify-start"
      onClick={onClick}
    >
      {content}
    </Button>
  );
}
