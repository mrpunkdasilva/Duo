"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileForm, PasswordForm } from "./components/profile-form/profile-form.component";
import { ProfileView } from "./components/profile-view/profile-view.component";
import { ProfileSkeleton } from "./components/skeleton/skeleton.component";

type Mode = "view" | "edit" | "password";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { status } = useSession();
  const [mode, setMode] = useState<Mode>("view");
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
  const handleBack = () => setMode("view");

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title={t("title")} />
        <ProfileSkeleton />
      </PageContainer>
    );
  }

  if (mode === "edit") {
    return (
      <PageContainer>
        <PageHeader title={t("title")} />
        <ProfileForm onCancel={handleBack} onSaved={handleBack} />
      </PageContainer>
    );
  }

  if (mode === "password") {
    return (
      <PageContainer>
        <PageHeader title={t("title")} />
        <PasswordForm onCancel={handleBack} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={t("title")}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode("edit")}
            className="rounded-xl"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {t("edit")}
          </Button>
        }
      />
      <ProfileView
        bannerColor={bannerColor}
        onPasswordClick={() => setMode("password")}
      />
    </PageContainer>
  );
}
