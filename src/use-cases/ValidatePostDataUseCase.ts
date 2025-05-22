import { AppError, Errors } from "@/lib/errors";
import { serverFormSchema } from "@/schemas";
import { ZodError } from "zod";

export class ValidatePostDataUseCase {
	execute(formData: FormData) {
		try {
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
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				const message = error.errors.map(issue => issue.message).join(", ")
				throw Errors.Validation(message)

			}
			throw new AppError('Не удалось валидировать данные', false)

		}

	}
}