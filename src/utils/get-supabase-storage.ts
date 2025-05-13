export const getImageUrl = (path: string): string => {
	if (process.env.NODE_ENV === 'development') {
		return `${path}`
	}

	return `/storage/v1/object/public/post-images/${path}`
}
