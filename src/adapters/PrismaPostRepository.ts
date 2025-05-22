


import { PostRepository } from "@/ports/PostRepository";
import { Post } from "@/utils/types";
import { PrismaClient } from "@prisma/client";

export class PrismaPostRepository implements PostRepository {
	constructor(private prisma: PrismaClient) { }
	async getAllPosts(): Promise<Post[]> {
		return this.prisma.post.findMany({
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

	}
	async create(input: {
		title: string;
		price: string;
		mapUrl: string;
		categoryId: string;
		telegramPostId: string;
	}): Promise<void> {
		await this.prisma.post.create({ data: input })
	}

}