


import { PostRepository } from "@/ports/PostRepository";
import { handleRepositoryError } from "@/utils/handleRepositoryError";
import { Result } from "@/utils/result";
import { AppErrorCode, CreatePostInput, Post, ResultType } from "@/utils/types";
import { Prisma, PrismaClient } from "@prisma/client";

type DbPost = Prisma.PostGetPayload<{
	select: {
		id: true,
		title: true,
		price: true,
		mapUrl: true,
		telegramPost: {
			select: {
				id: true,
				postLink: true
				text: true,
				date: true,
				images: {
					select: {
						path: true,
						altText: true,
						mainImage: true,
						id: true
					}
				}
			}
		}
		category: { select: { id: true, name: true } }
	}

}>
function mapDbPostToPost(dbPost: DbPost): Post {
	return {
		id: dbPost.id,
		title: dbPost.title,
		price: dbPost.price,
		mapUrl: dbPost.mapUrl,
		category: {
			id: dbPost.category.id,
			name: dbPost.category.name
		},
		telegramPost: {
			id: dbPost.telegramPost.id,
			postLink: dbPost.telegramPost.postLink,
			text: dbPost.telegramPost.text,
			date: dbPost.telegramPost.date,
			images: dbPost.telegramPost.images
		}
	}
}

export class PrismaPostRepository implements PostRepository {
	constructor(private prisma: PrismaClient) { }
	async getAllPosts(): Promise<ResultType<Post[], AppErrorCode>> {
		try {
			const postsFromDb: DbPost[] = await this.prisma.post.findMany({
				select: {
					id: true,
					title: true,
					price: true,
					mapUrl: true,
					telegramPost: {
						select: {
							postLink: true,
							id: true,
							text: true,
							date: true,
							images: {
								select: {
									path: true,
									altText: true,
									mainImage: true,
									id: true
								},
								orderBy: {
									mainImage: 'desc'
								}
							}
						}

					},
					category: {
						select: {
							id: true,
							name: true
						}
					},


				},
				orderBy: {
					telegramPost: {
						date: "desc"
					}
				}
			})
			const posts: Post[] = postsFromDb.map(mapDbPostToPost)
			return Result.ok(posts)
		} catch (error) {
			return handleRepositoryError(error)
		}

	}
	async create(input: CreatePostInput): Promise<ResultType<{ id: string }, AppErrorCode>> {
		try {
			const post = await this.prisma.post.create({ data: input })
			return Result.ok({ id: post.id })
		} catch (error) {
			return handleRepositoryError(error)
		}
	}
}