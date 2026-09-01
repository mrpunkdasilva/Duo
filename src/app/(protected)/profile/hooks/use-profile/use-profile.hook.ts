"use client";

import { useState, useCallback, useEffect } from "react";

type Mode = "view" | "edit" | "password";

export function useProfile() {
  const [mode, setMode] = useState<Mode>("view");
  const [bannerColor, setBannerColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setBannerColor(data.data?.bannerColor || null);
        }
      } catch {} finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (mode !== "view") return;

    async function loadProfile() {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setBannerColor(data.data?.bannerColor || null);
        }
      } catch {}
    }

    loadProfile();
  }, [mode]);

  const handleBack = useCallback(() => setMode("view"), []);

  return {
    mode,
    setMode,
    bannerColor,
    isLoading,
    handleBack,
  };
}
