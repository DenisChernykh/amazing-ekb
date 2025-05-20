import supabase from '@/utils/supabase';
import fs from 'fs/promises'
import path from "path";

export class ImageStorageService {
	constructor(
		private localPath = 'public/images/',
		private supabaseBucket = 'post-images'
	) { }
	async saveLocally(buffer: Buffer, fileName: string): Promise<string> {
		const fullPath = path.join(process.cwd(), this.localPath)
		await fs.mkdir(fullPath, { recursive: true })
		const filePath = path.join(fullPath, fileName)
		try { await fs.access(filePath) } catch {
			await fs.writeFile(filePath, buffer)
			console.log(`Файл ${fileName} сохранен локально`);
		}

		return path.posix.join('/images', fileName)
	}
	async saveToSupabase(buffer: Buffer, fileName: string): Promise<string | undefined> {
		const { data: existingFiles, error: listError } = await supabase.storage.from(this.supabaseBucket).list(

		)
		if (listError) {
			console.error('Ошибка при проверке Supabase:', listError)
			return undefined
		}
		const alreadyExists = existingFiles?.some(file => file.name === fileName)
		if (alreadyExists) {
			console.log(`Файл ${fileName} уже существует в Supabase, пропускаем сохранение`);

		} else {
			const { error: uploadError } = await supabase.storage.from(this.supabaseBucket).upload(fileName, buffer, {
				contentType: 'image/jpeg',
				upsert: false
			})
			if (uploadError && uploadError.message !== 'The resource already exists') {
				console.error('Ошибка при загрузке в Supabase:', uploadError)
				return undefined

			}
			console.log(`Файл ${fileName} сохранен в Supabase`);

			const { data: publicUrlData } = supabase.storage.from(this.supabaseBucket).getPublicUrl(fileName)
			return publicUrlData?.publicUrl

		}
	}
}