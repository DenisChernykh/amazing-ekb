"use client";

import { Compass } from "lucide-react";
import { containerClass } from "@/components/catalogue/primitives";
import { cn } from "@/lib/utils";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className={cn(containerClass, "py-16")}>
      <div
        role="alert"
        className="bg-secondary rounded-[24px] px-6 py-16 text-center"
      >
        <Compass className="text-guide-link mx-auto mb-6" size={32} />
        <h1 className="text-[32px] tracking-[-.03em]">Небольшая остановка.</h1>
        <p className="text-muted-foreground mt-4">
          Не удалось загрузить данные. Попробуй ещё раз.
        </p>
        <button
          className="bg-primary hover:bg-guide-link mt-7 min-h-11 rounded-xl px-5 py-3 text-sm text-white"
          onClick={reset}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
