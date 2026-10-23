import type { Metadata } from "next";
import { getCatalogue } from "@/lib/catalogue/server";
import { Breadcrumbs, containerClass } from "@/components/catalogue/primitives";
import { PageIntro } from "@/components/catalogue/sections";
import { CategoryCard } from "@/components/catalogue/cards";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Все категории" };
export default async function CategoriesPage() {
  const { categories } = await getCatalogue();
  return (
    <>
      <Breadcrumbs items={[{ title: "Категории" }]} />
      <PageIntro
        eyebrow="Город по интересам"
        title={
          <>
            Куда хочется
            <br />
            сегодня?
          </>
        }
      >
        Для встречи, маленького путешествия или тихого вечера.
        <br />
        Выбери настроение — и посмотри места.
      </PageIntro>
      <section
        aria-label="Все категории"
        className={cn(
          containerClass,
          "grid gap-x-8 gap-y-4 pb-16 md:grid-cols-2 md:gap-y-7 md:pb-24",
        )}
      >
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </section>
    </>
  );
}
