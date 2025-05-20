import { serverFormSchema } from "@/schemas";

export class ValidatePostDataUseCase {
	execute(formData: FormData) {
		const title = formData.get("title");
		const price = formData.get("price");
		const mapUrl = formData.get("mapUrl");
		const category = formData.get("category");
		const telegramPost = formData.get("telegramPost");
		const images = formData.getAll("images");
		const data = {
			title, price, mapUrl, images, category, telegramPost
		}
		return serverFormSchema.parse(data)
	}
}