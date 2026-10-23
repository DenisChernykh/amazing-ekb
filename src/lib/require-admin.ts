import 'server-only';
import { cookies } from 'next/headers';
import { findProfile } from '@/adapters/cloudflare/repositories';
import { sessionUserId } from './session';

/** Read the current role from D1, not a potentially stale role in a cookie. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const id = await sessionUserId((await cookies()).get('session')?.value);
  if (!id) return false;
  const result = await findProfile(id);
  return result.success && result.data?.role === 'ADMIN';
}
