import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { localAssetPath } from '../../scripts/cloudflare/assets';
import { normalizeImagePath } from '@/shared/data-contracts';

export class ImageStorageService {
  async saveLocally(buffer: Buffer, fileName: string): Promise<string> {
    const key = normalizeImagePath(fileName);
    const target = localAssetPath(key);
    await mkdir(path.dirname(target), { recursive: true });
    try {
      const existing = await readFile(target);
      if (!existing.equals(buffer)) throw new Error(`Existing image has different content: ${key}`);
    } catch (error) {
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
      await writeFile(target, buffer, { flag: 'wx' });
    }
    return key;
  }
}
