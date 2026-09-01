"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

interface ProfileCardProps {
  name: string;
  email: string;
  image?: string | null;
  bannerColor?: string | null;
}

export function ProfileCard({ name, email, image, bannerColor }: ProfileCardProps) {
  const bannerStyle = useMemo(() => {
    return bannerColor
      ? { background: bannerColor }
      : { background: "linear-gradient(to right, var(--color-duo-rose), var(--color-duo-teal))" };
  }, [bannerColor]);

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <Box className="h-24" style={bannerStyle} />

      <CardContent className="relative px-6 pb-6">
        <Box className="relative -mt-12 mb-4">
          <Avatar className="h-24 w-24 ring-4 ring-background">
            <AvatarImage src={image || ""} alt={name} />
            <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-3xl font-bold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Box>

        <Heading as="h2" variant="section">{name}</Heading>
        
        <Text variant="muted">{email}</Text>
      </CardContent>
    </Card>
  );
}
