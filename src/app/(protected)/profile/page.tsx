"use client";

import { useProfilePage } from "./hooks/use-profile-page/use-profile-page.hook";
import { ProfileView } from "./views/profile-view/profile-view.view";
import { ProfileEditView } from "./views/profile-edit/profile-edit.view";
import { ProfilePasswordView } from "./views/profile-password/profile-password.view";
import { ProfileLoadingView } from "./views/profile-loading/profile-loading.view";
import type {
  ProfileLoadingViewProps,
  ProfileEditViewProps,
  ProfilePasswordViewProps,
  ProfileViewProps,
} from "./types/profile.types";

export default function ProfilePage() {
  const result = useProfilePage();

  switch (result.view) {
    case "loading":
      return <ProfileLoadingView {...result.props as ProfileLoadingViewProps} />;
    case "edit":
      return <ProfileEditView {...result.props as ProfileEditViewProps} />;
    case "password":
      return <ProfilePasswordView {...result.props as ProfilePasswordViewProps} />;
    case "view":
      return <ProfileView {...result.props as ProfileViewProps} />;
    default:
      return null;
  }
}
