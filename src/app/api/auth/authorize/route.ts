import { validateInitData } from "@/lib/validate-init-data"
import prisma from "@/utils/db"
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server"


const getKey = () => new TextEncoder().encode(JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET!
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN!

export async function POST(req: NextRequest) {
	try {
		const { initData } = await req.json()

		const result = validateInitData(initData, TG_BOT_TOKEN)

		if (!result) {
			return NextResponse.json({ error: 'Autentification failed' }, { status: 401 })
		}
		const tgUser = result.user
		const profile = await prisma.profile.upsert({
			where: { telegramId: tgUser.id.toString() },
			update: {
				firstName: tgUser.first_name,
				lastName: tgUser.last_name,
				username: tgUser.username,
				avatar: tgUser.photo_url
			},
			create: {
				telegramId: tgUser.id.toString(),
				firstName: tgUser.first_name,
				lastName: tgUser.last_name,
				username: tgUser.username,
				avatar: tgUser.photo_url,
				role: 'USER'
			}


		})
		const token = await new SignJWT({
			userId: profile.id,
			telegramId: profile.telegramId,
			role: profile.role
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('7d')
			.sign(getKey());

		const response = NextResponse.json({ profile })
		response.cookies.set('session', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});
		return response
	} catch (error) {
		console.error('authorize', error)
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
	}

}