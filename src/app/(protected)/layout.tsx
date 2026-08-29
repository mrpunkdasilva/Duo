"use client";

import { MobileNav } from "@/components/layout/mobile-nav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <main className="pb-20 md:pb-8">{children}</main>
    </div>
  );
}
