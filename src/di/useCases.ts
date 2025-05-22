import { CreatePostUseCase } from "@/use-cases/CreatePostUseCase";
import { imageRepo, postRepo } from "./adapters";
import { categoryResolver } from "./resolvers";
import { GetPostsUseCase } from "@/use-cases/GetPostsUseCase";
import { UpdateMainImageUseCase } from "@/use-cases/UpdateMainImageUseCase";

const deps = { postRepo, categoryResolver }
export const createPostUseCase = new CreatePostUseCase(deps)
export const getPostsUseCase = new GetPostsUseCase(postRepo)
export const updateMainImageUseCase = new UpdateMainImageUseCase(imageRepo)