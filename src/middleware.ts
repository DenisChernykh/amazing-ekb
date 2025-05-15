import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!;
const getKey = () => new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
	const token = req.cookies.get('session')?.value;
	const url = req.nextUrl.clone();

	if (process.env.SKIP_AUTH === 'true') {
		console.log('Middleware отключён через SKIP_AUTH');
		return NextResponse.next();
	}

	if (!token) {
		console.log('Нет токена');
		return NextResponse.redirect(new URL('/', req.url));
	}

	try {
		const { payload } = await jwtVerify(token, getKey());

		if (url.pathname === '/add-place' && payload.role !== 'ADMIN') {
			console.log('Доступ запрещен');
			return NextResponse.redirect(new URL('/quiz', req.url));
		}

		return NextResponse.next();
	} catch (err) {
		console.error('Ошибка JWT:', err);
		return NextResponse.redirect(new URL('/quiz', req.url));
	}
}

export const config = {
	matcher: ['/add-place'],
};