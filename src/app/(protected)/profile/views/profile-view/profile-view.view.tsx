import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { PageContainer } from "@/components/layout/page-container/page-container.component";
import { PageHeader } from "@/components/layout/page-header/page-header.component";
import { ProfileCard } from "../../components/profile-card/profile-card.component";
import { ProfileMenuItem } from "../../components/profile-menu-item/profile-menu-item.component";
import { ProfileViewProps } from "../../types/profile.types";

export function ProfileView({
  title,
  editText,
  onEdit,
  bannerColor,
  user,
  menuItems,
  signOutText,
}: ProfileViewProps) {
  return (
    <PageContainer>
      <PageHeader
        title={title}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="rounded-xl"
          >
            {editText}
          </Button>
        }
      />

      <ProfileCard
        name={user.name}
        email={user.email}
        image={user.image}
        bannerColor={bannerColor}
      />

      <Stack gap={2}>
        {menuItems.map((item, i) => (
          <ProfileMenuItem key={i} {...item} />
        ))}
      </Stack>

      <Button
        variant="outline"
        className="w-full h-12 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {signOutText}
      </Button>
    </PageContainer>
  );
}
