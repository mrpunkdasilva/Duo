"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useProfile } from "../use-profile/use-profile.hook";
import { LogOut, MapPin, Users, Tag, Lock } from "lucide-react";

type ViewKey = "loading" | "view" | "edit" | "password";

interface MenuItem {
  icon: ReactNode;
  iconBg: string;
  label: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

interface ProfileUser {
  name: string;
  email: string;
  image: string | null;
}

interface ProfilePageResult {
  view: ViewKey;
  props: Record<string, unknown>;
}

export function useProfilePage(): ProfilePageResult {
  const t = useTranslations("profile");
  const { status, data: session } = useSession();
  const { mode, setMode, bannerColor, handleBack } = useProfile();

  const user: ProfileUser = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "",
    image: session?.user?.image || null,
  };

  if (status === "loading") {
    return { view: "loading", props: { title: t("title") } };
  }

  if (mode === "edit") {
    return {
      view: "edit",
      props: { title: t("title"), onBack: handleBack, onSaved: handleBack },
    };
  }

  if (mode === "password") {
    return {
      view: "password",
      props: { title: t("title"), onBack: handleBack },
    };
  }

  const menuItems: MenuItem[] = [
    {
      icon: <Lock className="h-5 w-5 text-violet-500" />,
      iconBg: "bg-violet-500/10",
      label: t("changePassword"),
      description: t("changePasswordDescription"),
      onClick: () => setMode("password"),
    },
    {
      icon: <Users className="h-5 w-5 text-duo-teal" />,
      iconBg: "bg-duo-teal/10",
      label: t("myDuo"),
      description: t("myDuoDescription"),
      href: "/partner",
    },
    {
      icon: <MapPin className="h-5 w-5 text-duo-rose" />,
      iconBg: "bg-duo-rose/10",
      label: t("myPlaces"),
      description: t("myPlacesDescription"),
      href: "/places",
    },
    {
      icon: <Tag className="h-5 w-5 text-violet-500" />,
      iconBg: "bg-violet-500/10",
      label: t("myCategories"),
      description: t("myCategoriesDescription"),
      href: "/categories",
    },
  ];

  return {
    view: "view",
    props: {
      title: t("title"),
      editText: t("edit"),
      onEdit: () => setMode("edit"),
      bannerColor,
      user,
      menuItems,
      signOutText: t("signOut"),
    },
  };
}
