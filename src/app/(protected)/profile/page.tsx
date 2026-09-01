"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LogOut, MapPin, Users, Tag, Pencil, Lock } from "lucide-react";
import { ProfileCard } from "@/components/features/profile-card";
import { ProfileMenuItem } from "@/components/features/profile-menu-item";
import { ProfileForm, PasswordForm } from "@/components/features/profile-form";
import { ProfileSkeleton } from "./profile-skeleton";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<"view" | "edit" | "password">("view");
  const [bannerColor, setBannerColor] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setBannerColor(data.data?.bannerColor || null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (mode === "view") {
      fetchProfile();
    }
  }, [mode, fetchProfile]);

  const isLoading = status === "loading";

  return (
    <div className="px-4 pt-4 space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <Heading as="h1" variant="page">{t("title")}</Heading>
        {!isLoading && mode === "view" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode("edit")}
            className="rounded-xl"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {t("edit")}
          </Button>
        )}
      </div>

      {mode === "edit" && (
        <ProfileForm
          onCancel={() => setMode("view")}
          onSaved={() => setMode("view")}
        />
      )}

      {mode === "password" && (
        <PasswordForm onCancel={() => setMode("view")} />
      )}

      {isLoading && mode === "view" && <ProfileSkeleton />}

      {!isLoading && mode === "view" && (
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
              onClick={() => setMode("password")}
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
      )}
    </div>
  );
}
