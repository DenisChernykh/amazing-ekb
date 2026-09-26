# Amazing EKB — Telegram Mini App

Next.js on Vercel serves the app. A Cloudflare Worker provides the private data API,
Cloudflare D1 stores the catalogue and profiles, and Workers Static Assets serves photos.
The deployed app does not connect to Supabase or PostgreSQL.

## Development

Use Node.js 22+ and the pnpm version in `package.json`.

```sh
pnpm install
cp .env.example .env
cp cloudflare/.dev.vars.example cloudflare/.dev.vars
pnpm assets:from-repo
pnpm cf:migrate:local
pnpm cf:dev
# In another terminal:
pnpm dev
```

Set matching `CLOUDFLARE_APP_TOKEN` / `APP_API_TOKEN` values in the two private files.
Tokens and `JWT_SECRET` must contain at least 32 characters. The catalogue is public;
Telegram login verifies signed `initData`. Every administrative write checks the current
profile's `ADMIN` role in D1. Never expose service tokens in `NEXT_PUBLIC_*` variables.

```sh
pnpm test
pnpm types
pnpm cf:check
pnpm lint
pnpm build
```

The tests run the bundled Worker against real local D1 in Miniflare. They cover migration,
token separation, Telegram signatures, role preservation, atomic cover selection,
repeat imports, missing assets, conflicting paths and transaction rollback.

## Deployment and data operations

See [the migration and rollback runbook](docs/cloudflare-migration.md).

```sh
pnpm assets:hydrate
pnpm cf:deploy
```

Static Assets publishes a complete set of files on every deploy. Hydrate and verify the
tracked `cloudflare/asset-manifest.json` before publishing from a new checkout. Do not
publish just the new photographs. `public/images` is a historical bootstrap copy; the
current inventory is the manifest. Photos are not uploaded to Vercel.

## Manual Telegram import

Configure the local `TG_API_ID`, `TG_API_HASH`, `TG_CHANNEL`, `CLOUDFLARE_API_URL`, and
`CLOUDFLARE_IMPORT_TOKEN` from `.env.example`. Then run:

```sh
pnpm sync:telegram
```

The importer asks for Telegram login when needed, restores existing assets, downloads new
ones, publishes the full asset set, and only then writes posts and image links to D1.
Rerunning is safe. Existing hidden flags, selected cover images and admin metadata stay
intact. Commit the updated asset manifest after a successful import. There is no cron.

`prisma/schema.prisma` and its SQL migrations are retained as a record of the original
PostgreSQL schema. The old Prisma adapters, seed commands and dual-write importer have
been removed; Supabase tooling is used only by the one-time backup/export command.
