"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileView } from "./components/views/profile-view/profile-view.component";
import { ProfileEditView } from "./components/views/profile-edit/profile-edit.component";
import { ProfilePasswordView } from "./components/views/profile-password/profile-password.component";
import { ProfileLoadingView } from "./components/views/profile-loading/profile-loading.component";
import { useProfile } from "@/hooks/use-profile";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { status } = useSession();
  const { mode, setMode, bannerColor, handleBack } = useProfile();

  if (status === "loading") {
    return <ProfileLoadingView />;
  }

  if (mode === "edit") {
    return <ProfileEditView onBack={handleBack} onSaved={handleBack} />;
  }

  if (mode === "password") {
    return <ProfilePasswordView onBack={handleBack} />;
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
