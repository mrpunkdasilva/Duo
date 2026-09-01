import { ReactNode } from "react";

export type ViewKey = "loading" | "view" | "edit" | "password";

export interface MenuItem {
  icon: ReactNode;
  iconBg: string;
  label: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

export interface ProfileUser {
  name: string;
  email: string;
  image: string | null;
}

export interface ProfileLoadingViewProps {
  title: string;
}

export interface ProfileEditViewProps {
  title: string;
  onBack: () => void;
  onSaved: () => void;
}

export interface ProfilePasswordViewProps {
  title: string;
  onBack: () => void;
}

export interface ProfileViewProps {
  title: string;
  editText: string;
  onEdit: () => void;
  bannerColor: string | null;
  user: ProfileUser;
  menuItems: MenuItem[];
  signOutText: string;
}

export type ProfilePageResult =
  | { view: "loading"; props: ProfileLoadingViewProps }
  | { view: "edit"; props: ProfileEditViewProps }
  | { view: "password"; props: ProfilePasswordViewProps }
  | { view: "view"; props: ProfileViewProps };
