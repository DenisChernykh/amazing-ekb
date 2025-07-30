import { AppErrorCode, ResultType } from "@/utils/types";


export interface CategoryResolver {
	resolve(categoryName: string): Promise<ResultType<string, AppErrorCode>>
}