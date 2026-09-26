import 'server-only';
import { z } from 'zod';
import { errorResponseSchema, type DataErrorCode } from '@/shared/data-contracts';
import { ResultType } from '@/utils/types';

export async function dataRequest<T>(path: string, schema: z.ZodType<T, z.ZodTypeDef, unknown>, init: RequestInit = {}): Promise<ResultType<T, DataErrorCode>> {
  const base = process.env.CLOUDFLARE_API_URL;
  const token = process.env.CLOUDFLARE_APP_TOKEN;
  if (!base || !token) return { success: false, error: 'DATABASE_CONNECTION_ERROR' };
  try {
    const response = await fetch(new URL(path, base), {
      ...init, cache: 'no-store', signal: AbortSignal.timeout(15_000),
      headers: { 'Content-Type': 'application/json', ...init.headers, Authorization: `Bearer ${token}` },
    });
    const body: unknown = await response.json();
    const failure = errorResponseSchema.safeParse(body);
    if (failure.success) return failure.data;
    const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(body);
    if (!response.ok || !envelope.success) return { success: false, error: 'DATABASE_ERROR' };
    const result = schema.safeParse(envelope.data.data);
    if (!result.success) return { success: false, error: 'DATABASE_ERROR' };
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'DATABASE_CONNECTION_ERROR' };
  }
}
