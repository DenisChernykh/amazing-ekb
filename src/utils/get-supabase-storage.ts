const supabaseUrl = 'https://hqajvfrvzozkuqhnxdyl.supabase.co'
export const getImageUrl = (path: string): string => {
	if (process.env.NODE_ENV === 'development') {
		return `${path}`
	}

	return `${supabaseUrl}/storage/v1/object/public/post-images/${path}`
}
