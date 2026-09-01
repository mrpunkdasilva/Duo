import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Stack } from "@/components/ui/stack";

interface FormFieldProps {
  htmlFor?: string;
  label: ReactNode;
  children: ReactNode;
}

export function FormField({ htmlFor, label, children }: FormFieldProps) {
  return (
    <Stack gap={2}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
    </Stack>
  );
}
