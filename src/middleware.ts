import { NextRequest, NextResponse } from 'next/server';
import { sessionUserId } from '@/lib/session';

export async function middleware(req: NextRequest) {
  if (!await sessionUserId(req.cookies.get('session')?.value)) return NextResponse.redirect(new URL('/', req.url));
  // The page and each write action check the current database role.
  return NextResponse.next();
}
export const config = { matcher: ['/add-place'] };
