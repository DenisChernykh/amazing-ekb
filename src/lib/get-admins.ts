export function getAdminsIds(): number[] {
	const raw = process.env.ADMINS_IDS || ''
	return raw.split(',').map(id => Number(id.trim())).filter(Boolean)
}