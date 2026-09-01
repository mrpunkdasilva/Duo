"use client";

import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileSkeleton } from "../skeleton/skeleton.component";

export function ProfileLoadingView() {
  const t = useTranslations("profile");

  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      <ProfileSkeleton />
    </PageContainer>
  );
}
