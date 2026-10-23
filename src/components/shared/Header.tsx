"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X } from "lucide-react";
import { ActionLink, containerClass } from "@/components/catalogue/primitives";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/categories", title: "Категории" },
  { href: "/collections", title: "Подборки" },
  { href: "/#about", title: "О проекте" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !panel.current?.contains(event.target) &&
        !button.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);
  return (
    <header className="bg-background relative z-30 pt-[env(safe-area-inset-top)]">
      <a
        href="#main"
        className="text-guide-link sr-only rounded-xl bg-white p-3 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Перейти к содержимому
      </a>
      <div
        className={cn(
          containerClass,
          "flex h-[76px] items-center justify-between md:h-[78px]",
        )}
      >
        <Link
          href="/"
          aria-label="Amazing EKB — главная"
          onClick={() => setOpen(false)}
          className="flex items-center gap-[7px]"
        >
          <Compass
            className="text-guide-accent"
            size={22}
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="font-brand text-[21px] tracking-[-.9px]">
            amazing ekb
          </span>
        </Link>
        <nav
          aria-label="Главная навигация"
          className="hidden items-center gap-[30px] md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className="hover:text-guide-link aria-[current=page]:text-guide-link py-3 text-[13px]"
            >
              {item.title}
            </Link>
          ))}
          <ActionLink href="/categories">Выбрать место</ActionLink>
        </nav>
        <button
          ref={button}
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
          className="hover:bg-secondary -mr-2 flex size-11 items-center justify-center rounded-xl md:hidden"
        >
          {open ? (
            <X size={23} strokeWidth={1.5} />
          ) : (
            <Menu size={23} strokeWidth={1.5} />
          )}
        </button>
      </div>
      {open && (
        <nav
          ref={panel}
          id="mobile-navigation"
          aria-label="Мобильная навигация"
          className="animate-menu-in border-border bg-background absolute inset-x-0 top-full flex flex-col items-center gap-3 border-b px-5 pt-4 pb-8 shadow-sm md:hidden"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-xl"
            >
              {item.title}
            </Link>
          ))}
          <div onClick={() => setOpen(false)}>
            <ActionLink href="/categories">Выбрать место</ActionLink>
          </div>
        </nav>
      )}
    </header>
  );
}
