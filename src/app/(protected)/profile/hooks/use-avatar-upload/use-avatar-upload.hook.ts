"use client";

import { useRef, useCallback } from "react";
import { isFileSizeValid } from "../../utils/file-utils/file-utils.utils";

interface UseAvatarUploadProps {
  onUpload: (url: string) => void;
}

export function useAvatarUpload({ onUpload }: UseAvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFileSizeValid(file.size)) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      onUpload(data.url);
    }
  }, [onUpload]);

  return {
    fileInputRef,
    triggerFileInput,
    handleFileChange,
  };
}
