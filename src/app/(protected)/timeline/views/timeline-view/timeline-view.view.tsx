"use client";

import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { Stack } from "@/components/ui/stack";
import { useTranslations } from "next-intl";
import { useTimeline } from "../../hooks/use-timeline/use-timeline.hook";
import { TimelineItemCard } from "../../components/timeline-item/timeline-item.component";
import { TimelineMonthHeader } from "../../components/timeline-month/timeline-month.component";
import { TimelineEmpty } from "../../components/timeline-empty/timeline-empty.component";
import { SkeletonCard, SkeletonLine, Skeleton } from "@/components/ui/skeleton";

export function TimelineView() {
  const t = useTranslations("timeline");
  const { months, isLoading, error } = useTimeline();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title={t("title")} />
        <Stack gap={4}>
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i}>
              <div className="p-4 flex gap-3">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonLine className="h-4 w-20" />
                  <SkeletonLine className="h-5 w-40" />
                  <SkeletonLine className="h-3 w-24" />
                </div>
              </div>
            </SkeletonCard>
          ))}
        </Stack>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title={t("title")} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </PageContainer>
    );
  }

  if (months.length === 0) {
    return (
      <PageContainer>
        <PageHeader title={t("title")} />
        <TimelineEmpty />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={t("title")} />
      <Stack gap={6}>
        {months.map((month) => (
          <div key={month.month}>
            <TimelineMonthHeader label={month.label} />
            <Stack gap={3}>
              {month.items.map((item) => (
                <TimelineItemCard key={item.id} item={item} />
              ))}
            </Stack>
          </div>
        ))}
      </Stack>
    </PageContainer>
  );
}
