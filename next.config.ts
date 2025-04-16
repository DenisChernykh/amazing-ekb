import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ['hqajvfrvzozkuqhnxdyl.supabase.co'],
	},
	/* config options here */
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},

	},
};

export default nextConfig;
