"use client";

import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileForm } from "../../components/profile-form/profile-form.component";

interface ProfileEditViewProps {
  onBack: () => void;
  onSaved: () => void;
}

export function ProfileEditView({ onBack, onSaved }: ProfileEditViewProps) {
  const t = useTranslations("profile");

  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      <ProfileForm onCancel={onBack} onSaved={onSaved} />
    </PageContainer>
  );
}
