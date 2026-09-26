import { findProfile } from '@/adapters/cloudflare/repositories';
import { sessionUserId } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = await sessionUserId(req.cookies.get('session')?.value);
  if (!id) return NextResponse.json({ user: null });
  const result = await findProfile(id);
  if (!result.success) return NextResponse.json({ error: 'Data service unavailable' }, { status: 503 });
  const profile = result.data;
  return NextResponse.json({ user: profile ? { id: profile.id, firstName: profile.firstName,
    role: profile.role, username: profile.username, avatar: profile.avatar } : null });
}
