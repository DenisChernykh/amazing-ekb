import { PostDuplicateChecker } from "@/ports/PostDuplicateChecker";

export class CheckDuplicateUseCase {
	constructor(private readonly checker: PostDuplicateChecker) { }
	async execute(id: string): Promise<void> {
		const exists = await this.checker.existsById(id)
		if (exists) {
			throw new Error(`Пост с id ${id} уже существует`);
		}
	}
}