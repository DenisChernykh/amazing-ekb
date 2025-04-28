import { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Проверка секретного ключа
	if (req.headers['x-secret-key'] !== process.env.API_SECRET) {
		return res.status(403).json({ error: 'Forbidden' })
	}

	try {
		// Запускаем Python-скрипт
		const { stdout } = await execAsync('python3 scripts/process.py')

		// Возвращаем результат
		res.json({
			success: true,
			data: JSON.parse(stdout)
		})
	} catch (error) {
		res.status(500).json({
			error: 'Ошибка обработки',
			details: error instanceof Error ? error.message : 'Unknown error'
		})
	}
}