import { getCatalogue } from "@/lib/catalogue/server";
import {
  CardGrid,
  CategoryCard,
  CollectionCard,
} from "@/components/catalogue/cards";
import {
  ActionLink,
  containerClass,
  Eyebrow,
  Photo,
  SectionHeading,
} from "@/components/catalogue/primitives";
import { FinalCTA, Hero, Quote } from "@/components/catalogue/sections";
import { Reveal } from "@/components/catalogue/Reveal";
import { cn } from "@/lib/utils";

export default async function Home() {
  const catalogue = await getCatalogue();
  return (
    <>
      <Hero
        home
        eyebrow="Стрельчук в Екатеринбурге"
        title={
          <>
            Открой город.
            <br />
            Найди своё.
          </>
        }
        description={
          <>
            Места, в которые хочется заглянуть.
            <br />И поводы увидеть Екатеринбург по-новому.
          </>
        }
        image="/guide/yekaterinburg-panorama.png"
        imageAlt="Панорама Екатеринбурга и городского пруда"
      >
        <ActionLink href="/categories">Выбрать место</ActionLink>
      </Hero>
      <Quote>
        За любимым кофе, длинными разговорами и маленькими открытиями. Всё это —
        в твоём городе.
      </Quote>
      <section
        className={cn(containerClass, "pt-20 pb-12 md:pt-[120px] md:pb-24")}
      >
        <SectionHeading eyebrow="Категории" title="Куда хочется сегодня?">
          <ActionLink href="/categories">Все категории</ActionLink>
        </SectionHeading>
        <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 md:gap-y-7">
          {catalogue.categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
      <section
        id="about"
        className={cn(
          containerClass,
          "grid items-center gap-10 py-12 md:grid-cols-2 md:gap-20 md:py-24",
        )}
      >
        <Photo
          src="/guide/gorozhane.jpg"
          alt="Интерьер городского бистро"
          className="h-[340px] md:h-[460px]"
          sizes="(max-width: 767px) calc(100vw - 40px), 520px"
        />
        <Reveal>
          <Eyebrow>О проекте</Eyebrow>
          <h2 className="mt-7 text-[32px] leading-[1.2] tracking-[-.035em] md:text-[42px]">
            Город становится ближе через любимые места.
          </h2>
          <p className="text-muted-foreground mt-7 text-[15px] leading-[1.55] md:text-[17px]">
            Amazing EKB собирает места и публикации проекта «Стрельчук в
            Екатеринбурге». Здесь можно выбрать, куда сходить, посмотреть обзоры
            и сохранить идею на потом.
          </p>
          <a
            href="https://t.me/tanya_strelchuk_blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-guide-link mt-7 block text-lg"
          >
            Стрельчук в Екатеринбурге
          </a>
          <ActionLink href="/collections" className="mt-7">
            Смотреть подборки
          </ActionLink>
        </Reveal>
      </section>
      <section className={cn(containerClass, "pt-16 pb-12 md:pt-24 md:pb-24")}>
        <SectionHeading eyebrow="Подборки" title="Планы уже придуманы." />
        <CardGrid three>
          {catalogue.collections.slice(0, 3).map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </CardGrid>
        <div className="mt-8">
          <ActionLink href="/collections" secondary>
            Все подборки
          </ActionLink>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
