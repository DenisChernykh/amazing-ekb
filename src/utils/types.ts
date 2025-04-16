export type Category = {
	id: string;
	name: string;
};
export type Post = {
	id: string;
	title: string;
}
export type ImageType = {
	id: string;
	imageUrl: string | null;
	altText: string | null;
	mainImage: boolean | null;
};



export type TelegramPost = {
	id: string;
	text: string;
	date: Date;
	postLink: string;
	images: ImageType[];
};