import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
