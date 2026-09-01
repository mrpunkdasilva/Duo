"use client";

import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { PasswordForm } from "../../components/profile-form/profile-form.component";

interface ProfilePasswordViewProps {
  onBack: () => void;
}

export function ProfilePasswordView({ onBack }: ProfilePasswordViewProps) {
  const t = useTranslations("profile");

  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      <PasswordForm onCancel={onBack} />
    </PageContainer>
  );
}
