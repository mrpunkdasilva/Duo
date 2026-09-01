"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form-wrapper";
import { FormActions } from "@/components/ui/form-actions";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { usePasswordForm } from "../../hooks/use-password-form/use-password-form.hook";
import { Lock } from "lucide-react";

interface PasswordFormProps {
  onCancel: () => void;
}

export function PasswordForm({ onCancel }: PasswordFormProps) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isSaving,
    error,
    success,
    handleSubmit,
  } = usePasswordForm();

  return (
    <Form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <Flex align="center" gap={2} className="mb-2">
            <Lock className="h-4 w-4 text-violet-500" />
            <Heading as="h3" variant="card">{t("changePassword")}</Heading>
          </Flex>

          <FormField htmlFor="currentPassword" label={t("currentPassword")}>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </FormField>

          <FormField htmlFor="newPassword" label={t("newPassword")}>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </FormField>

          <FormField htmlFor="confirmPassword" label={t("confirmPassword")}>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </FormField>

          {error && <Text variant="error">{error}</Text>}
          {success && <Text variant="success">{t("passwordUpdated")}</Text>}
        </CardContent>
      </Card>

      <FormActions
        onCancel={onCancel}
        cancelText={tc("cancel")}
        submitText={t("changePassword")}
        isSaving={isSaving}
        savingText={tc("saving")}
        submitIcon={<Lock className="h-4 w-4 mr-2" />}
      />
    </Form>
  );
}
