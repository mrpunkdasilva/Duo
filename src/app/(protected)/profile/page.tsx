"use client";

import { useProfilePage } from "./hooks/use-profile-page/use-profile-page.hook";
import { ProfileView } from "./views/profile-view/profile-view.view";
import { ProfileEditView } from "./views/profile-edit/profile-edit.view";
import { ProfilePasswordView } from "./views/profile-password/profile-password.view";
import { ProfileLoadingView } from "./views/profile-loading/profile-loading.view";

export default function ProfilePage() {
  const { view, props } = useProfilePage();

  switch (view) {
    case "loading":
      return <ProfileLoadingView {...props as { title: string }} />;
    case "edit":
      return <ProfileEditView {...props as { title: string; onBack: () => void; onSaved: () => void }} />;
    case "password":
      return <ProfilePasswordView {...props as { title: string; onBack: () => void }} />;
    case "view":
      return <ProfileView {...props as any} />;
    default:
      return null;
  }
}
