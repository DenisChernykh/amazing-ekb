import prisma from "@/utils/db";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!
const getKey = () => new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
	const token = req.cookies.get('session')?.value;
	if (!token) return NextResponse.json({ user: null })
	try {
		const { payload } = await jwtVerify(token, getKey());

		const user = await prisma.profile.findUnique({
			where: { id: payload.userId as string },
			select: {
				id: true,
				firstName: true,
				role: true,
				username: true,
				avatar: true,
			}
		})
		return NextResponse.json({ user })
	} catch (err) {
		console.error('get me', err);
		return NextResponse.json({ user: null });
	}
}