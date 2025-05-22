import { categoryRepo, imageRepo, postRepo } from "./adapters";
import { categoryResolver } from "./resolvers";
import { createPostUseCase, getPostsUseCase, updateMainImageUseCase } from "./useCases";

export const container = {
	createPostUseCase,
	getPostsUseCase,
	updateMainImageUseCase,
	postRepo,
	categoryRepo,
	imageRepo,
	categoryResolver
};

export type Container = typeof container