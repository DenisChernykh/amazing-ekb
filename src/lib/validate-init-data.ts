import crypto from 'crypto'

export function validateInitData(initData: string, botToken: string) {
	const params = new URLSearchParams(initData)
	const hash = params.get('hash')
	params.delete('hash')

	const dataCheckString = [...params.entries()].map(([key, val]) => `${key}=${val}`).sort().join('\n')
	const secret = crypto.createHash('sha256').update(botToken).digest()
	const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')
	if (hmac !== hash) return null

	const userJson = params.get('user')
	if (!userJson) return null
	try {
		const user = JSON.parse(userJson)
		return { user }
	} catch {
		return null
	}
}