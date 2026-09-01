import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { PasswordForm } from "../../components/profile-form/password-form.component";

interface ProfilePasswordViewProps {
  title: string;
  onBack: () => void;
}

export function ProfilePasswordView({ title, onBack }: ProfilePasswordViewProps) {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <PasswordForm onCancel={onBack} />
    </PageContainer>
  );
}
