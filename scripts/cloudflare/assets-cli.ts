import 'dotenv/config';
import { cp, mkdir } from 'node:fs/promises';
import { assetRoot, hydrateAssets, verifyAssets, writeManifest } from './assets';

async function main() {
  switch (process.argv[2]) {
    case 'from-repo':
      await mkdir(assetRoot, { recursive: true });
      await cp('public/images', `${assetRoot}/images`, { recursive: true, force: false });
      // Keep the authoritative inventory: a stale checkout must not drop live images.
      await verifyAssets();
      break;
    case 'hydrate':
      if (!process.env.CLOUDFLARE_API_URL) throw new Error('CLOUDFLARE_API_URL is required');
      await hydrateAssets(process.env.CLOUDFLARE_API_URL);
      break;
    case 'manifest': await writeManifest(); break;
    case 'verify': await verifyAssets(); break;
    default: throw new Error('Use from-repo, hydrate, manifest or verify');
  }
  console.log('Assets verified');
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'Asset check failed'); process.exitCode = 1; });
