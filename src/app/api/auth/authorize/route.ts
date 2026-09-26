import { validateInitData } from '@/lib/validate-init-data';
import { upsertProfile } from '@/adapters/cloudflare/repositories';
import { sessionKey } from '@/lib/session';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = z.object({ initData: z.string().max(16_384) }).safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    const botToken = process.env.TG_BOT_TOKEN;
    if (!botToken) throw new Error('TG_BOT_TOKEN is required');
    const result = validateInitData(body.data.initData, botToken);
    if (!result) return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    const user = result.user;
    const saved = await upsertProfile({ telegramId: String(user.id), firstName: user.first_name,
      lastName: user.last_name, username: user.username, avatar: user.photo_url });
    if (!saved.success) return NextResponse.json({ error: 'Data service unavailable' }, { status: 503 });
    const profile = saved.data;
    const token = await new SignJWT({ userId: profile.id, telegramId: profile.telegramId, role: profile.role })
      .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(sessionKey());
    const response = NextResponse.json({ profile });
    response.cookies.set('session', token, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 604800 });
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    console.error('Telegram authorization failed');
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
