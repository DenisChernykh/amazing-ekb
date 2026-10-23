import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  buildCatalogue,
  paginate,
  parsePage,
  placeCount,
  safeExternalUrl,
} from "../src/lib/catalogue/model";
import type { Post } from "../src/utils/types";

test("five editorial selections only reference confirmed places and source publications", () => {
  const catalogue = buildCatalogue();
  assert.equal(catalogue.collections.length, 5);
  assert.equal(catalogue.places.length, 58);
  assert.equal(catalogue.publications.length, 244);
  const publications = new Map(
    catalogue.publications.map((publication) => [publication.id, publication]),
  );
  const places = new Map(catalogue.places.map((place) => [place.slug, place]));
  assert.equal(places.size, catalogue.places.length);
  assert.equal(publications.size, catalogue.publications.length);
  for (const collection of catalogue.collections) {
    assert.ok(collection.placeSlugs.length >= 4);
    assert.equal(
      new Set(collection.placeSlugs).size,
      collection.placeSlugs.length,
    );
    for (const slug of collection.placeSlugs) assert.ok(places.has(slug), slug);
  }
  for (const place of catalogue.places) {
    assert.ok(place.publicationIds.length > 0, place.slug);
    for (const id of place.publicationIds) {
      const publication = publications.get(id);
      assert.ok(publication, `${place.slug}: ${id}`);
      assert.ok(safeExternalUrl(publication.url));
      assert.doesNotMatch(
        publication.subject,
        /место не установлено|название не указано|без обзора места/i,
      );
      assert.ok(!publication.categories.includes("Розыгрыши"));
    }
    for (const slug of place.categorySlugs)
      assert.ok(
        catalogue.categories.some((category) => category.slug === slug),
        slug,
      );
  }
});

test("all bundled photographs exist; legacy photographs belong to the published asset inventory", () => {
  const catalogue = buildCatalogue();
  const manifest = JSON.parse(
    readFileSync("cloudflare/asset-manifest.json", "utf8"),
  );
  const published = new Set(
    manifest.files.map((file: { path: string }) => file.path),
  );
  const images = [
    ...catalogue.categories.map((category) => category.image),
    ...catalogue.collections.map((collection) => collection.cover),
    ...catalogue.places.flatMap((place) => [place.cover, ...place.images]),
  ];
  for (const image of images) {
    if (!image) continue;
    assert.ok(
      image.startsWith("/images/")
        ? published.has(image)
        : existsSync(`public${image}`),
      image,
    );
  }
});

function post(overrides: Partial<Post> = {}): Post {
  return {
    id: "live-place",
    title: "Сандуны Урал",
    price: "Цена из API",
    mapUrl: "https://example.com/map",
    category: { id: "baths", name: "Баня" },
    telegramPost: {
      id: "270",
      postLink: "https://t.me/tanya_strelchuk_blog/270",
      date: new Date("2026-01-01"),
      text: "Обзор",
      images: [
        {
          id: "photo",
          path: "/images/post-270-0.jpg",
          altText: null,
          mainImage: true,
        },
      ],
    },
    ...overrides,
  };
}

test("live data updates the correct place without duplicating it or mutating editorial content", () => {
  const catalogue = buildCatalogue([post()]);
  assert.equal(catalogue.places.length, 58);
  const sanduny = catalogue.places.find(
    (place) => place.slug === "sanduny-ural",
  )!;
  assert.equal(sanduny.mapsUrl, "https://example.com/map");
  assert.equal(sanduny.cover, "/images/post-270-0.jpg");
  assert.ok(sanduny.publicationIds.some((id) => id.startsWith("dzen-")));
  assert.ok(sanduny.legacyIds?.includes("live-place"));
  assert.equal(sanduny.editableImages?.[0].id, "photo");
  assert.notEqual(
    buildCatalogue().places.find((place) => place.slug === "sanduny-ural")!
      .mapsUrl,
    "https://example.com/map",
  );
});

test("matching venue names do not merge unrelated publications; new API records remain reachable", () => {
  const newPost = post({
    telegramPost: {
      ...post().telegramPost,
      id: "99999",
      postLink: "https://t.me/tanya_strelchuk_blog/99999",
    },
  });
  const catalogue = buildCatalogue([newPost]);
  assert.equal(catalogue.places.length, 59);
  const added = catalogue.places.find(
    (place) => place.slug === "place-live-place",
  )!;
  assert.deepEqual(added.categorySlugs, ["baths"]);
  assert.deepEqual(added.publicationIds, ["live-99999"]);
});

test("an outdated API map cannot restore a venue link rejected by the registry audit", () => {
  const artPost = post({
    title: "Школа искусств Alvas",
    mapUrl: "https://yandex.ru/maps/org/alvas/33270198211/?mode=search",
    telegramPost: {
      ...post().telegramPost,
      id: "174",
      postLink: "https://t.me/tanya_strelchuk_blog/174",
      images: [],
    },
  });
  const place = buildCatalogue([artPost]).places.find(
    (place) => place.slug === "kulturnye-tsennosti",
  )!;
  assert.equal(place.title, "Культурные ценности");
  assert.equal(place.mapsUrl, null);
  assert.equal(
    buildCatalogue([
      { ...artPost, mapUrl: "https://example.com/corrected-map" },
    ]).places.find((place) => place.slug === "kulturnye-tsennosti")!.mapsUrl,
    "https://example.com/corrected-map",
  );
});

test("pagination rejects malformed and out-of-range pages, and keeps all items reachable", () => {
  for (const input of [
    "0",
    "-1",
    "1.5",
    "1e2",
    "2junk",
    "Infinity",
    ["1", "2"],
    "9007199254740992",
  ])
    assert.equal(parsePage(input), null);
  assert.equal(parsePage(undefined), 1);
  assert.equal(parsePage("2"), 2);
  const items = Array.from({ length: 43 }, (_, index) => index);
  assert.deepEqual(
    [1, 2, 3].flatMap((page) => paginate(items, page).items),
    items,
  );
  assert.equal(paginate(items, 4).valid, false);
  assert.equal(paginate([], 1).valid, true);
});

test("missing or unsafe map links stay absent; Russian place counts agree", () => {
  for (const url of [
    "",
    "javascript:alert(1)",
    "data:text/html,test",
    "/untrusted",
  ])
    assert.equal(safeExternalUrl(url), null);
  assert.equal(
    safeExternalUrl("https://example.com/map"),
    "https://example.com/map",
  );
  assert.deepEqual([1, 2, 5, 11, 21, 22].map(placeCount), [
    "1 место",
    "2 места",
    "5 мест",
    "11 мест",
    "21 место",
    "22 места",
  ]);
});
