# Cloudflare migration and rollback

## Rollout status — 2026-09-26

The implementation, production build and 16 automated tests pass. Local browser checks
cover catalogue rendering, six-category filtering, signed login, access restrictions
and creating a place card. Both D1 databases contain the source snapshot: 6 categories,
68 profiles, 72 Telegram posts, 18 place cards and 222 image records. All 222 source
photos are backed up locally and published as staging and production Static Assets.

Cloudflare email verification is resolved. Both Workers are published with separate
secrets and working health endpoints. Every field in both databases and SHA-256 hashes
of all 222 publicly served photos match the backup. The final Supabase snapshot at
2026-09-26 07:33:01 UTC, taken after source writes were frozen, matches the imported data.
Staging API reads, writes, token separation and a signed test-user session have been
checked; its temporary test records were removed.

Vercel staging and production variables are configured, preserving `TG_BOT_TOKEN`.
Session signing keys were rotated; users will sign in again through Telegram.
The cutover is complete: `https://amazing-ekb.vercel.app` serves deployment
`dpl_HFJer2FPjj7KT7XLfueiLKHUwXqh` using the production Worker and D1. Browser checks
on the live URL confirm all 18 cards, working photos, anonymous admin restrictions and
rejection of forged Telegram login. Six-category filtering was verified on the deployed
preview. A genuine Telegram login still requires the user's acceptance check; tests used
isolated staging/local sessions, never fabricated production identities.

The original Supabase data and photo bucket are retained. The five app tables have
`cloudflare_migration_read_only` triggers to prevent writes from retired app sessions.
The rollback scripts below remove only these migration guards. No Supabase project was
deleted or paused. The code remains in the migration PR; deploying the old `main` branch
would restore obsolete Supabase code, so use the migration branch until it is merged.

## Topology

```text
Telegram → Next.js (Vercel) → private Worker API → D1
                    photos → Workers Static Assets
local Telegram importer   → publish assets → import API → D1
```

Production keeps `https://amazing-ekb.vercel.app`. Vercel retains the existing bot token.
Cloudflare account ID is pinned in `cloudflare/wrangler.jsonc`; staging and production
have separate Workers, databases and service secrets. R2, billing activation and cron
are not required. The app uses Telegram authentication, not Supabase Auth.

## Required configuration

| Location | Variables |
| --- | --- |
| Worker secrets | `APP_API_TOKEN`, `IMPORT_API_TOKEN` (independent random secrets, at least 32 characters) |
| Worker configuration | `DB`, `ASSETS`, `READ_ONLY` |
| Vercel server | `CLOUDFLARE_API_URL`, `CLOUDFLARE_APP_TOKEN`, `JWT_SECRET`, existing `TG_BOT_TOKEN` |
| Vercel build and client | `NEXT_PUBLIC_ASSET_BASE_URL` |
| Local import | `CLOUDFLARE_API_URL`, `CLOUDFLARE_IMPORT_TOKEN`, Telegram API credentials from `.env.example` |

Generate service secrets with a cryptographically secure generator and store them outside
Git. Use `wrangler secret bulk private-file.json` or `wrangler secret put`. Never put
tokens in Wrangler `vars`, public environment variables, shell arguments or committed files.
`APP_API_TOKEN` is trusted only on the Next.js server. The importer token cannot access
profiles or admin APIs. Browser writes require a valid session and a current D1 admin role.

This workstation uses a project-specific Wrangler login:

```sh
export XDG_CONFIG_HOME="$PWD/.cloudflare-auth"
pnpm exec wrangler whoami
```

This avoids changing a login for another Cloudflare account. On other machines use your
normal login, but verify the account ID first. Cloudflare must report the account email
as verified before Workers can be published.

Provisioned resources:

| Environment | D1 database ID | Worker address (once enabled) |
| --- | --- | --- |
| Staging | `9215626a-bfdb-49ed-91ab-734fd5667d73` | `https://amazing-ekb-data-staging.amazing-ekb1.workers.dev` |
| Production | `2baab7df-e106-4b71-bcdd-cf135042bd58` | `https://amazing-ekb-data.amazing-ekb1.workers.dev` |

The pre-migration production deployment is `dpl_8usFCCDuie4wdtz5Sg78huK8bcY4`
(`https://amazing-jwvtnaqxl-denis-projects-91ecd61e.vercel.app`).

## Backup and import

Stop manual imports and administrative edits during the final snapshot and switch.
Run `scripts/cloudflare/freeze-supabase.sql` against the source PostgreSQL database
immediately before the final snapshot and promotion. It installs reversible statement
triggers on the five app tables, blocking inserts, updates, deletes and truncation while
leaving reads available. Keep these guards on the retired source to prevent writes from
old browser sessions. If the switch is aborted, run `scripts/cloudflare/unfreeze-supabase.sql`.
A stale snapshot must never replace a database receiving writes.

For a direct PostgreSQL backup, load `SUPABASE_DB_URL`, `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` into a private environment, then run:

```sh
pnpm migration:export
```

The exporter uses a read-only repeatable-read snapshot of all five public app tables,
saves column metadata, checks unexpected tables, and downloads the entire `post-images`
bucket. Keep `snapshot.json`, `source-schema.json`, `data.sql`, the asset manifest and
a copy of `cloudflare/assets/images` together in private backup storage.

The initial migration was also exported through the official Supabase Management API
using one read-only SELECT containing all five tables and the storage inventory. Its
private source copy is under `.migration/source-2026-09-26`. Timestamps from PostgreSQL
are normalized to UTC ISO strings; identifiers, roles, text, hidden flags, cover choices,
relations and the historical `Profile.updatetAd` column are preserved.

Only `Image.path` intentionally changes: historical Supabase URLs or filenames become
canonical `/images/filename` keys. Path collisions or missing images fail the migration.

Create fresh D1 databases and put their IDs in the corresponding Wrangler environment.
Never run a snapshot import against a database with newer records.

```sh
pnpm exec wrangler d1 create amazing-ekb-staging --config cloudflare/wrangler.jsonc
pnpm exec wrangler d1 migrations apply DB --remote --env staging --config cloudflare/wrangler.jsonc
pnpm exec wrangler d1 execute DB --remote --env staging --config cloudflare/wrangler.jsonc --file .migration/<backup>/data.sql
pnpm exec wrangler deploy --env staging --config cloudflare/wrangler.jsonc
pnpm exec wrangler secret bulk .migration/<staging-secrets>.json --env staging --config cloudflare/wrangler.jsonc
CLOUDFLARE_API_URL=https://<staging-worker>.workers.dev pnpm migration:verify .migration/<backup>/snapshot.json --remote --staging
```

The verifier compares every field in every row, including profile roles and relationships,
and downloads the published files to compare their byte sizes and SHA-256 hashes against
the asset manifest. Static Assets may omit Content-Length, so a HEAD check is insufficient.
Counts alone are insufficient.
Test catalogue, category filtering, gallery, genuine Telegram login, admin creation,
cover selection, repeat import and failures in staging. Use separate test credentials
for automated authentication tests, never forge production user sessions.

## Production cutover

1. Record the current Vercel deployment URL/ID for rollback. Keep its existing secrets on
   Vercel; do not export all production environment variables.
2. Freeze writes, make a fresh source snapshot, and verify it matches the staged dataset.
   If records changed, import the new snapshot into a fresh production D1 database.
3. Apply D1 migrations, import the snapshot and publish the complete asset set to the
   production Worker. Configure separate production tokens. Run full migration verification.
4. Configure the three Cloudflare variables on the Vercel production target, preserving
   `TG_BOT_TOKEN`. If rotating `JWT_SECRET`, users will sign in again through Telegram.
5. Deploy the validated branch to Vercel with the production asset origin supplied at
   build time. Check catalogue, images, login and admin access before resuming writes.
6. Retain Supabase and private backups until the new deployment has been accepted.

There are no SQL migrations in `vercel-build`. Schema changes are applied explicitly by
Wrangler before the application release.

## Assets and manual imports

Every Workers deployment replaces the complete asset inventory. The checked-in manifest
contains byte sizes and SHA-256 hashes. `pnpm assets:hydrate` restores missing files from
the current Worker and refuses mismatches; `pnpm cf:deploy` verifies every listed file.
Do not regenerate the manifest from an incomplete folder. `assets:from-repo` only fills
the historical bootstrap files and still verifies the current manifest.

The importer publishes files before database links. A publication failure leaves D1
unchanged; a failing D1 batch rolls back that post and all of its images. If a later post
fails, earlier completed posts remain imported; rerun the importer to finish safely.
The pending input batch is saved privately as `.migration-pending.json` for diagnosis.
Paths are immutable: changed bytes at an existing path require a new filename.
Imports preserve hidden flags, image IDs, selected covers and existing admin fields.

Static Assets Free currently permits 20,000 files, each at most 25 MiB. The validation
enforces these limits; check current Cloudflare limits when the catalogue grows.

## Rollback

Before any new D1 writes, run `scripts/cloudflare/unfreeze-supabase.sql` against Supabase,
then restore the recorded Vercel deployment to route traffic back to Supabase. Deployment
environment values are captured with that deployment. Do not delete the Cloudflare data
or original source backup.

After D1 has accepted new writes, a Vercel rollback alone would lose those changes from the
user's view. First set `READ_ONLY=true` and publish the Worker, stop importers, export D1
with `wrangler d1 export DB --remote --output <private-backup.sql>`, and reconcile the
new/changed profiles, categories, posts and image choices into the rollback database
(remove its write guards with `scripts/cloudflare/unfreeze-supabase.sql` before reconciliation).
Verify before switching. No automatic reverse migration is provided.

To roll back Worker code while keeping D1, use a known compatible Worker version. Never
undo a D1 schema migration or restore a stale SQL snapshot onto a live writable database.

## Network access

Cloudflare access from Russia may require a VPN, as accepted for this deployment.
Vercel fetches data on the server; browser image loading still needs a working route to
the configured asset host.
