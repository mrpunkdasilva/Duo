import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileForm } from "../../components/profile-form/profile-form.component";
import { ProfileEditViewProps } from "../../types/profile.types";

export function ProfileEditView({ title, onBack, onSaved }: ProfileEditViewProps) {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <ProfileForm onCancel={onBack} onSaved={onSaved} />
    </PageContainer>
  );
}
