import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileForm } from "../../components/profile-form/profile-form.component";

interface ProfileEditViewProps {
  title: string;
  onBack: () => void;
  onSaved: () => void;
}

export function ProfileEditView({ title, onBack, onSaved }: ProfileEditViewProps) {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <ProfileForm onCancel={onBack} onSaved={onSaved} />
    </PageContainer>
  );
}
