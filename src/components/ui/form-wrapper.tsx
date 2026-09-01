import { cn } from "@/lib/utils";
import { ReactNode, FormHTMLAttributes } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function Form({ children, className, ...props }: FormProps) {
  return (
    <form className={cn("space-y-4", className)} {...props}>
      {children}
    </form>
  );
}
