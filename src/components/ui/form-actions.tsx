import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  cancelText: string;
  submitText: string;
  isSaving?: boolean;
  savingText?: string;
  submitIcon?: ReactNode;
}

export function FormActions({
  onCancel,
  cancelText,
  submitText,
  isSaving = false,
  savingText,
  submitIcon,
}: FormActionsProps) {
  return (
    <Flex gap={3}>
      <Button
        type="button"
        variant="outline"
        className="flex-1 h-12 rounded-xl"
        onClick={onCancel}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {savingText}
          </>
        ) : (
          <>
            {submitIcon}
            {submitText}
          </>
        )}
      </Button>
    </Flex>
  );
}
