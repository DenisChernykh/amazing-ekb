import { jwtVerify } from 'jose';

export function sessionKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');
  return new TextEncoder().encode(secret);
}

export async function sessionUserId(token?: string): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionKey(), { algorithms: ['HS256'] });
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch { return null; }
}
