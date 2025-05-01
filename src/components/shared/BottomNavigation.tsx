"use client";
import { FileText, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function BottomNavigation() {
  const pathname = usePathname();
  const getIconClass = (path: string) =>
    pathname === path ? "var(--chart-5)" : "var(--primary";

  return (
    <nav className="min-h-nav bg-accent fixed right-0 bottom-0 left-0 flex items-center justify-around">
      <Link href="/">
        <FileText color={getIconClass("/")} />
      </Link>
      <Link href="/quiz">
        <Gamepad2 color={getIconClass("/quiz")} />
      </Link>
    </nav>
  );
}

export default BottomNavigation;
