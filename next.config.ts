import type { NextConfig } from 'next';

const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
if (assetBase && !/^https?:\/\//.test(assetBase)) throw new Error('NEXT_PUBLIC_ASSET_BASE_URL must be an absolute URL');
const nextConfig: NextConfig = {
  images: { remotePatterns: assetBase ? [new URL('/images/**', assetBase)] : [] },
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
};
export default nextConfig;
