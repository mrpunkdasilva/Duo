import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
