import { containerClass } from "@/components/catalogue/primitives";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Загружаем места"
      className={cn(containerClass, "py-16")}
    >
      <span className="sr-only">Загружаем места…</span>
      <div className="grid animate-pulse items-center gap-12 motion-reduce:animate-none md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-secondary h-5 w-32 rounded-lg" />
          <div className="bg-secondary h-24 w-4/5 rounded-2xl" />
          <div className="bg-secondary h-12 w-full rounded-xl" />
          <div className="bg-secondary h-11 w-36 rounded-xl" />
        </div>
        <div className="bg-secondary h-[310px] rounded-[24px] md:h-[450px]" />
      </div>
    </div>
  );
}
