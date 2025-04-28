import { CategoriesContext } from "@/context/categories-context";
import { useContext } from "react";

export function useCategories() {
	const context = useContext(CategoriesContext);
	if (context === undefined) {
		throw new Error('useCategories must be used within a CategoriesProvider');
	}
	return { ...context, categories: context.categories || [] };
}