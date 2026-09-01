import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileSkeleton } from "../../components/skeleton/skeleton.component";

interface ProfileLoadingViewProps {
  title: string;
}

export function ProfileLoadingView({ title }: ProfileLoadingViewProps) {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <ProfileSkeleton />
    </PageContainer>
  );
}
