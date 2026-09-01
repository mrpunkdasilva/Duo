"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";

interface ProfileCardProps {
  name: string;
  email: string;
  image?: string | null;
  bannerColor?: string | null;
}

export function ProfileCard({ name, email, image, bannerColor }: ProfileCardProps) {
  const bannerStyle = bannerColor
    ? { background: bannerColor }
    : undefined;

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div
        className="h-24"
        style={bannerStyle || { background: "linear-gradient(to right, var(--color-duo-rose), var(--color-duo-teal))" }}
      />
      <CardContent className="relative px-6 pb-6">
        <div className="relative -mt-12 mb-4">
          <Avatar className="h-24 w-24 ring-4 ring-background">
            <AvatarImage src={image || ""} alt={name} />
            <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-3xl font-bold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <Heading as="h2" variant="section">{name}</Heading>
        <p className="text-sm text-muted-foreground">{email}</p>
      </CardContent>
    </Card>
  );
}
