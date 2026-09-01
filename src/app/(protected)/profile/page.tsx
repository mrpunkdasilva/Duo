"use client";

import { useProfilePage } from "./hooks/use-profile-page/use-profile-page.hook";
import { ProfileView } from "./views/profile-view/profile-view.view";
import { ProfileEditView } from "./views/profile-edit/profile-edit.view";
import { ProfilePasswordView } from "./views/profile-password/profile-password.view";
import { ProfileLoadingView } from "./views/profile-loading/profile-loading.view";

export default function ProfilePage() {
  const result = useProfilePage();

  switch (result.view) {
    case "loading":
      return <ProfileLoadingView {...result.props} />;
    case "edit":
      return <ProfileEditView {...result.props} />;
    case "password":
      return <ProfilePasswordView {...result.props} />;
    case "view":
      return <ProfileView {...result.props} />;
    default:
      return null;
  }
}
