import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

const telegramUserSchema = z.object({
  id: z.number().int().positive().safe(), first_name: z.string().min(1).max(256),
  last_name: z.string().max(256).optional(), username: z.string().max(256).optional(),
  photo_url: z.string().url().max(2048).optional(),
});

export function validateInitData(initData: string, botToken: string, now = Date.now()) {
  if (!botToken || typeof initData !== 'string' || initData.length > 16_384) return null;
  const params = new URLSearchParams(initData);
  if (new Set(params.keys()).size !== [...params.keys()].length) return null;
  const hash = params.get('hash');
  const authDate = Number(params.get('auth_date'));
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash) || !Number.isSafeInteger(authDate)) return null;
  const age = now / 1000 - authDate;
  if (age < -30 || age > 3600) return null;
  const check = [...params.entries()].filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([key, value]) => `${key}=${value}`).join('\n');
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const signature = createHmac('sha256', secret).update(check).digest();
  if (!timingSafeEqual(signature, Buffer.from(hash, 'hex'))) return null;
  try {
    // URLSearchParams has already decoded the value once.
    const user = telegramUserSchema.parse(JSON.parse(params.get('user') ?? 'null'));
    return { user };
  } catch { return null; }
}
