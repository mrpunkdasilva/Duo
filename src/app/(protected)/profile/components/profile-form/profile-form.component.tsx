"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form-wrapper";
import { FormActions } from "@/components/ui/form-actions";
import { FormField } from "@/components/ui/form-field";
import { AvatarUpload } from "../avatar-upload/avatar-upload.component";
import { BannerPicker } from "../banner-picker/banner-picker.component";
import { useProfileForm } from "../../hooks/use-profile-form/use-profile-form.hook";
import { User as UserIcon, Save } from "lucide-react";

interface ProfileFormProps {
  onCancel: () => void;
  onSaved: () => void;
}

export function ProfileForm({ onCancel, onSaved }: ProfileFormProps) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const {
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
    handleSave,
  } = useProfileForm({ onSaved });

  return (
    <Form onSubmit={handleSave}>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <Flex align="center" gap={2} className="mb-2">
            <UserIcon className="h-4 w-4 text-duo-rose" />
            <Heading as="h3" variant="card">{t("editProfile")}</Heading>
          </Flex>

          <AvatarUpload
            name={name}
            image={image}
            onImageChange={setImage}
            onRemoveImage={() => setImage("")}
            removeText={t("removeImage")}
          />

          <BannerPicker
            value={bannerColor}
            onChange={setBannerColor}
            label={t("bannerColor")}
            resetText={t("resetBanner")}
          />

          <FormField htmlFor="name" label={t("name")}>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </FormField>

          <FormField htmlFor="email" label={t("email")}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
            />
          </FormField>

          {error && <Text variant="error">{error}</Text>}
        </CardContent>
      </Card>

      <FormActions
        onCancel={onCancel}
        cancelText={tc("cancel")}
        submitText={tc("save")}
        isSaving={isSaving}
        savingText={tc("saving")}
        submitIcon={<Save className="h-4 w-4 mr-2" />}
      />
    </Form>
  );
}
