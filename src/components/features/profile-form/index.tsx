"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import {
  Loader2,
  Save,
  Lock,
  User as UserIcon,
  Camera,
  Palette,
} from "lucide-react";

const BANNER_PRESETS = [
  "linear-gradient(to right, #f43f5e, #14b8a6)",
  "linear-gradient(to right, #8b5cf6, #ec4899)",
  "linear-gradient(to right, #f97316, #eab308)",
  "linear-gradient(to right, #06b6d4, #3b82f6)",
  "linear-gradient(to right, #10b981, #059669)",
  "linear-gradient(to right, #6366f1, #a855f7)",
  "linear-gradient(to right, #ef4444, #f97316)",
  "linear-gradient(to right, #64748b, #334155)",
];

interface ProfileFormProps {
  onCancel: () => void;
  onSaved: () => void;
}

export function ProfileForm({ onCancel, onSaved }: ProfileFormProps) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState("");
  const [bannerColor, setBannerColor] = useState(
    (session?.user as any)?.bannerColor || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.image) {
      setImage(session.user.image);
    }
  }, [session?.user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError(t("imageTooLarge"));
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError(t("error"));
        return;
      }

      const data = await res.json();
      setImage(data.url);
    } catch {
      setError(t("error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
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
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="h-4 w-4 text-duo-rose" />
            <Heading as="h3" variant="card">{t("editProfile")}</Heading>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-2xl font-bold">
                  {name.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-duo-rose text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {image && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-destructive"
                onClick={() => setImage("")}
              >
                {t("removeImage")}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5" />
              {t("bannerColor")}
            </Label>
            <div className="flex gap-2 flex-wrap">
              {BANNER_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBannerColor(preset)}
                  className={`h-8 w-8 rounded-lg transition-all ${
                    bannerColor === preset
                      ? "ring-2 ring-offset-2 ring-duo-rose scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ background: preset }}
                />
              ))}
              <label className="h-8 w-8 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/60 transition-colors">
                <input
                  type="color"
                  value={bannerColor ? colorFromGradient(bannerColor) : "#f43f5e"}
                  onChange={(e) =>
                    setBannerColor(e.target.value)
                  }
                  className="sr-only"
                />
                <span className="text-[10px] text-muted-foreground">+</span>
              </label>
            </div>
            {bannerColor && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setBannerColor("")}
              >
                {t("resetBanner")}
              </Button>
            )}
            <div
              className="h-16 rounded-xl overflow-hidden"
              style={{
                background: bannerColor || "linear-gradient(to right, var(--color-duo-rose), var(--color-duo-teal))",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("name")}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onCancel}
        >
          {tc("cancel")}
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {tc("saving")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {tc("save")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function colorFromGradient(gradient: string): string {
  const match = gradient.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : "#f43f5e";
}

export function PasswordForm({ onCancel }: { onCancel: () => void }) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setError(t("currentPasswordRequired"));
      return;
    }
    if (newPassword.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("error"));
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError(t("error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-violet-500" />
            <Heading as="h3" variant="card">{t("changePassword")}</Heading>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              {t("currentPassword")}
            </Label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              {t("newPassword")}
            </Label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              {t("confirmPassword")}
            </Label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && (
            <p className="text-xs text-green-600">{t("passwordUpdated")}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onCancel}
        >
          {tc("cancel")}
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {tc("saving")}
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              {t("changePassword")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
