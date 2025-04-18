
import { FilterContext } from "@/context/filter-context";
import { useContext } from "react";

export function useFilter() {
	const context = useContext(FilterContext);
	if (context === undefined) {
		throw new Error('useFilter must be used within a FilterProvider');
	}
	return context;
}
