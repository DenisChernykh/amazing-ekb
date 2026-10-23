import { containerClass, EmptyState } from "@/components/catalogue/primitives";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className={cn(containerClass, "py-16 md:py-24")}>
      <h1 className="sr-only">Страница не найдена</h1>
      <EmptyState
        title="Кажется, мы свернули не туда."
        description="Такой страницы нет. Но в городе ещё много интересного — начни с категорий."
      />
    </div>
  );
}
