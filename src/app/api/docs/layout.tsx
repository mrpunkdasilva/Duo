import Link from "next/link";
import { Heart } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 fill-duo-rose text-duo-rose" />
            <span className="text-xl font-bold text-gradient">duo</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
}
