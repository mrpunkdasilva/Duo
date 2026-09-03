"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, MapPin, Heart, Users, Film } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", icon: Home, label: "Início" },
  { href: "/places", icon: MapPin, label: "Lugares" },
  { href: "/movies", icon: Film, label: "Filmes" },
  { href: "/partner", icon: Users, label: "Duo" },
];

export function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      {/* Top bar - mobile */}
      <header className="sticky top-0 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 h-14 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <Link href="/home" className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-duo-rose text-duo-rose" />
            <span className="text-lg font-bold text-gradient">duo</span>
          </Link>
          <Link href="/profile">
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-xs font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Desktop header */}
      <header className="sticky top-0 z-50 hidden md:block">
        <div className="flex items-center justify-between px-6 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <Link href="/home" className="flex items-center gap-2">
            <Heart className="h-6 w-6 fill-duo-rose text-duo-rose" />
            <span className="text-xl font-bold text-gradient">duo</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href))
                      ? "bg-duo-rose/10 text-duo-rose"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {session?.user?.name?.split(" ")[0]}
            </span>
            <Link href="/profile">
              <Avatar className="h-9 w-9 ring-2 ring-white cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark font-bold">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom nav - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = item.href === "/home"
              ? pathname === "/home"
              : pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 transition-all",
                    isActive ? "text-duo-rose" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "fill-duo-rose/20")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
