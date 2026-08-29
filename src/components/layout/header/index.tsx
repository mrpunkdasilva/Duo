"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, MapPin, Settings, User } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/places">
            <Button
              variant={pathname.startsWith("/places") ? "secondary" : "ghost"}
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Lugares
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
