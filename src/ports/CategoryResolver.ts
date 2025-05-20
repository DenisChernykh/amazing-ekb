export interface CategoryResolver {
	resolve(categoryName: string): Promise<string>
}