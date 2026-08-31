"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import pt from "../../i18n/locales/pt.json";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale="pt" messages={pt} timeZone="America/Sao_Paulo">
        <TooltipProvider>{children}</TooltipProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
