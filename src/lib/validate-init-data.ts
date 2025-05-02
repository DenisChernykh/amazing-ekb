import crypto from "crypto"

export const validateInitData = (initData: string, botToken: string) => {
	const urlSearchParams = new URLSearchParams(initData);
	const data = Object.fromEntries(urlSearchParams.entries());

	const checkString = Object.keys(data)
		.filter(key => key !== 'hash')
		.map(key => `${key}=${data[key]}`)
		.sort()
		.join('\n');

	const secretKey = crypto.createHmac('sha256', botToken)
		.update('WebAppData')
		.digest();

	const signature = crypto.createHmac('sha256', secretKey)
		.update(checkString)
		.digest('hex');


	try {
		const user = JSON.parse(decodeURIComponent(data.user));
		return { user, signature };
	} catch (e) {
		console.error('Failed to parse user param', e);
		return null;
	}
}