import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActionLink, containerClass, Eyebrow, Photo } from "./primitives";
import { Reveal } from "./Reveal";

export function Hero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
  home = false,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  image: string | null;
  imageAlt: string;
  children?: ReactNode;
  home?: boolean;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        containerClass,
        "grid items-center gap-10 pt-10 pb-16 md:grid-cols-[448fr_616fr] md:gap-14 md:pt-[64px] md:pb-24",
        home && "md:pt-[50px] md:pb-32",
        compact && "md:grid-cols-2 md:gap-20 md:pb-20",
      )}
    >
      <div className="animate-hero-copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className={cn(
            "mt-6 text-[48px] leading-[1.15] tracking-[-.045em] break-words md:mt-7 md:text-[64px]",
            compact && "text-[40px] md:text-[56px]",
          )}
        >
          {title}
        </h1>
        <div className="text-muted-foreground mt-6 text-base leading-[1.55] md:mt-7 md:text-[17px]">
          {description}
        </div>
        {children && (
          <div className="mt-7 flex flex-wrap items-center gap-4">
            {children}
          </div>
        )}
      </div>
      <div className="animate-hero-photo relative">
        <Photo
          src={image}
          alt={imageAlt}
          priority
          className={cn(
            "h-[310px] md:h-[450px]",
            compact && "h-[260px] md:h-[360px]",
          )}
        />
        {home && (
          <>
            <span className="absolute top-[14%] left-[10%] rounded-[5px] bg-white/90 px-2.5 py-[5px] text-[13px]">
              Вкусно
            </span>
            <span className="absolute top-[40%] right-[13%] rounded-[5px] bg-white/90 px-2.5 py-[5px] text-[13px]">
              Красиво
            </span>
            <span className="absolute bottom-[17%] left-[23%] rounded-[5px] bg-white/90 px-2.5 py-[5px] text-[13px]">
              Рядом
            </span>
          </>
        )}
      </div>
    </section>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(containerClass, "pt-10 pb-12 md:pt-[64px] md:pb-16")}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-6 text-[40px] leading-[1.16] tracking-[-.035em] md:mt-7 md:text-[44px]">
        {title}
      </h1>
      <div className="text-muted-foreground mt-7 max-w-[600px] text-base leading-[1.6] md:text-[17px]">
        {children}
      </div>
    </section>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-[960px] px-6 text-center">
      <p className="text-[26px] leading-[1.55] tracking-[-.025em] whitespace-pre-line md:text-[34px]">
        {children}
      </p>
    </Reveal>
  );
}

export function FinalCTA() {
  return (
    <section className={cn(containerClass, "pt-16 md:pt-16")}>
      <div className="relative flex min-h-[410px] items-end justify-center overflow-hidden rounded-[24px] px-5 pt-14 md:min-h-[470px] md:pt-[90px]">
        <Photo
          src="/guide/cta-background.jpg"
          alt=""
          className="absolute inset-0 h-full w-full"
          sizes="1120px"
        />
        <div className="bg-background/85 absolute inset-0" />
        <div className="bg-background relative z-10 flex min-h-[354px] w-full max-w-[650px] flex-col items-center gap-6 rounded-t-[24px] px-5 pt-8 pb-12 text-center md:min-h-[380px] md:px-[50px] md:pt-12">
          <Eyebrow>Планы на выходные</Eyebrow>
          <h2 className="text-[28px] leading-[1.2] tracking-[-.035em] md:text-[40px]">
            Твоё следующее
            <br />
            любимое место — здесь.
          </h2>
          <p className="text-muted-foreground text-sm leading-[1.5] md:text-base">
            Начни с подборки. Остальное сложится по пути.
          </p>
          <ActionLink href="/collections">Открыть подборки</ActionLink>
        </div>
      </div>
    </section>
  );
}

export function Pagination({
  page,
  pages,
  basePath,
}: {
  page: number;
  pages: number;
  basePath: string;
}) {
  if (pages <= 1) return null;
  const visible = [...new Set([1, page - 1, page, page + 1, pages])]
    .filter((item) => item >= 1 && item <= pages)
    .sort((a, b) => a - b);
  return (
    <nav
      aria-label="Страницы списка"
      className="border-border mt-12 flex flex-wrap items-center justify-center gap-2 border-t pt-8"
    >
      {page > 1 && (
        <Link
          aria-label="Предыдущая страница"
          className="text-guide-link hover:bg-secondary flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3"
          href={`${basePath}?page=${page - 1}#places`}
        >
          ←
        </Link>
      )}
      {visible.map((item, index) => (
        <span key={item} className="flex items-center gap-2">
          {index > 0 && item - visible[index - 1] > 1 && (
            <span aria-hidden="true">…</span>
          )}
          <Link
            href={`${basePath}?page=${item}#places`}
            aria-label={`Страница ${item}`}
            aria-current={page === item ? "page" : undefined}
            className="text-guide-link hover:bg-secondary aria-[current=page]:bg-primary flex min-h-11 min-w-11 items-center justify-center rounded-xl aria-[current=page]:text-white"
          >
            {item}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link
          aria-label="Следующая страница"
          className="text-guide-link hover:bg-secondary flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3"
          href={`${basePath}?page=${page + 1}#places`}
        >
          →
        </Link>
      )}
    </nav>
  );
}
