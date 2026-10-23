import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/image-url";

export const containerClass = "mx-auto w-full max-w-[1160px] px-5";

export function Photo({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 50vw, 616px",
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "bg-secondary relative overflow-hidden rounded-[24px]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src.startsWith("/images/") ? getImageUrl(src) : src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />
      ) : (
        <div className="text-muted-foreground flex h-full min-h-48 flex-col items-center justify-center gap-3">
          <Compass size={30} strokeWidth={1} aria-hidden="true" />
          <span className="text-sm">Фотографии скоро появятся</span>
        </div>
      )}
    </div>
  );
}

export function Eyebrow({
  children,
  plain = false,
}: {
  children: ReactNode;
  plain?: boolean;
}) {
  return (
    <span
      className={cn(
        "text-guide-link inline-block w-fit text-[10px] leading-[15px] tracking-[.035em] uppercase",
        !plain && "rounded-lg bg-white px-2 py-1",
      )}
    >
      {children}
    </span>
  );
}

export function ActionLink({
  href,
  children,
  secondary = false,
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex min-h-11 w-fit items-center justify-center gap-2.5 text-[13px] leading-5 transition-colors",
        secondary
          ? "text-guide-link hover:text-primary"
          : "bg-primary hover:bg-guide-link rounded-xl px-3.5 py-2.5 text-white",
        className,
      )}
    >
      {!secondary && (
        <span className="text-primary flex size-[22px] shrink-0 items-center justify-center rounded-lg bg-white">
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
            aria-hidden="true"
          />
        </span>
      )}
      {children}
      {secondary && (
        <ArrowUpRight
          size={14}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
        />
      )}
    </Link>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { title: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className={cn(
        containerClass,
        "text-muted-foreground py-4 text-xs leading-5 md:py-[15px]",
      )}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-guide-link">
            Главная
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-guide-link">
                {item.title}
              </Link>
            ) : (
              <span aria-current="page">{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-5 md:mb-12 md:flex-row md:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-5 text-[32px] leading-[1.18] tracking-[-.035em] md:mt-7 md:text-[44px]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export function EmptyState({
  title = "Здесь пока тихо.",
  description = "Новые места появятся совсем скоро. А пока загляни в другие категории.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="bg-secondary rounded-[24px] px-6 py-14 text-center">
      <Compass
        className="text-guide-link mx-auto mb-5"
        size={32}
        strokeWidth={1.3}
        aria-hidden="true"
      />
      <h2 className="text-[28px]">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-4 mb-6 max-w-md">
        {description}
      </p>
      <ActionLink href="/categories">Все категории</ActionLink>
    </div>
  );
}
