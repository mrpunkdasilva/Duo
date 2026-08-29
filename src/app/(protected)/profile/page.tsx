"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ChevronRight, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: session } = useSession();

  const userName = session?.user?.name || "Usuário";
  const userEmail = session?.user?.email || "";

  return (
    <div className="px-4 pt-4 space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* Profile card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-duo-rose to-duo-teal" />
        <CardContent className="relative px-6 pb-6">
          <div className="relative -mt-12 mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarImage src={session?.user?.image || ""} alt={userName} />
              <AvatarFallback className="bg-duo-rose/10 text-duo-rose text-3xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </CardContent>
      </Card>

      {/* Menu items */}
      <div className="space-y-2">
        <Link href="/partner" className="block">
          <Card className="border-0 shadow-sm hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 py-4 px-4">
              <div className="w-10 h-10 rounded-xl bg-duo-teal/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-duo-teal" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{t("myDuo")}</p>
                <p className="text-xs text-muted-foreground">{t("myDuoDescription")}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/places" className="block">
          <Card className="border-0 shadow-sm hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 py-4 px-4">
              <div className="w-10 h-10 rounded-xl bg-duo-rose/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-duo-rose" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{t("myPlaces")}</p>
                <p className="text-xs text-muted-foreground">{t("myPlacesDescription")}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Sign out */}
      <Button
        variant="outline"
        className="w-full h-12 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {t("signOut")}
      </Button>
    </div>
  );
}
