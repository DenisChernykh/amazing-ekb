import Link from "next/link";
import { containerClass } from "@/components/catalogue/primitives";
import { cn } from "@/lib/utils";
import AdminButton from "@/components/features/posts/AdminButton";

export default function Footer() {
  return (
    <footer
      className={cn(
        containerClass,
        "mt-auto pt-12 pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div className="bg-guide-footer flex flex-col gap-5 rounded-t-[24px] px-6 py-6 md:min-h-28 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
        <Link href="/" className="font-brand text-[21px] tracking-[-.9px]">
          amazing ekb
        </Link>
        <nav
          aria-label="Навигация в подвале"
          className="text-muted-foreground flex flex-col gap-2 text-[13px] md:flex-row md:gap-6"
        >
          <Link className="hover:text-guide-link py-1" href="/categories">
            Категории
          </Link>
          <Link className="hover:text-guide-link py-1" href="/collections">
            Подборки
          </Link>
          <Link className="hover:text-guide-link py-1" href="/#about">
            О проекте
          </Link>
          <Link className="hover:text-guide-link py-1" href="/quiz">
            Квиз о городе
          </Link>
        </nav>
        <a
          href="https://t.me/tanya_strelchuk_blog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-guide-link text-xs"
        >
          Стрельчук в Екатеринбурге
        </a>
      </div>
      <AdminButton />
    </footer>
  );
}
