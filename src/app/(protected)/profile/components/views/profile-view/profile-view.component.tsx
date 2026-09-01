"use client";

import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { LogOut, MapPin, Users, Tag, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "../../profile-card/profile-card.component";
import { ProfileMenuItem } from "../../profile-menu-item/profile-menu-item.component";

interface ProfileViewProps {
  bannerColor: string | null;
  onPasswordClick: () => void;
}

export function ProfileView({ bannerColor, onPasswordClick }: ProfileViewProps) {
  const t = useTranslations("profile");
  const { data: session } = useSession();

  return (
    <>
      <ProfileCard
        name={session?.user?.name || "Usuário"}
        email={session?.user?.email || ""}
        image={session?.user?.image}
        bannerColor={bannerColor}
      />

      <div className="space-y-2">
        <ProfileMenuItem
          icon={<Lock className="h-5 w-5 text-violet-500" />}
          iconBg="bg-violet-500/10"
          label={t("changePassword")}
          description={t("changePasswordDescription")}
          onClick={onPasswordClick}
        />
        <ProfileMenuItem
          icon={<Users className="h-5 w-5 text-duo-teal" />}
          iconBg="bg-duo-teal/10"
          label={t("myDuo")}
          description={t("myDuoDescription")}
          href="/partner"
        />
        <ProfileMenuItem
          icon={<MapPin className="h-5 w-5 text-duo-rose" />}
          iconBg="bg-duo-rose/10"
          label={t("myPlaces")}
          description={t("myPlacesDescription")}
          href="/places"
        />
        <ProfileMenuItem
          icon={<Tag className="h-5 w-5 text-violet-500" />}
          iconBg="bg-violet-500/10"
          label={t("myCategories")}
          description={t("myCategoriesDescription")}
          href="/categories"
        />
      </div>

      <Button
        variant="outline"
        className="w-full h-12 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {t("signOut")}
      </Button>
    </>
  );
}
