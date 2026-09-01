"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

interface UseProfileFormProps {
  onSaved: () => void;
}

export function useProfileForm({ onSaved }: UseProfileFormProps) {
  const t = useTranslations("profile");
  const { data: session, update } = useSession();

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [bannerColor, setBannerColor] = useState(
    (session?.user as Record<string, string>)?.bannerColor || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && email.trim().includes("@");
  }, [name, email]);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(t("nameRequired"));
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(t("emailRequired"));
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          image,
          bannerColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("error"));
        return;
      }

      await update();
      onSaved();
    } catch {
      setError(t("error"));
    } finally {
      setIsSaving(false);
    }
  }, [name, email, image, bannerColor, t, update, onSaved]);

  return {
    name,
    setName,
    email,
    setEmail,
    image,
    setImage,
    bannerColor,
    setBannerColor,
    isSaving,
    error,
    isFormValid,
    handleSave,
  };
}
