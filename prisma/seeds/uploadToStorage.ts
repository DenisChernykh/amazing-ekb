import { supabase } from "@/utils/supabase";
import fs from "fs";
import path from "path";

const localImagePath = path.resolve("public/images");
const bucketName = "post-images";

export async function uploadToStorage(postId: string, filename: string) {
	const filePath = path.join(localImagePath, filename);
	const fileData = fs.readFileSync(filePath);
	const storagePath = `post-${postId}/${filename}`;

	const { error } = await supabase.storage
		.from(bucketName)
		.upload(storagePath, fileData, {
			upsert: true,
			contentType: "image/jpeg", // можно адаптировать под нужный MIME-тип
		});

	if (error) {
		throw new Error(`Ошибка при загрузке файла ${filename}: ${error.message}`);
	}

	const { data: publicUrlData } = supabase.storage
		.from(bucketName)
		.getPublicUrl(storagePath);

	return publicUrlData.publicUrl;
}