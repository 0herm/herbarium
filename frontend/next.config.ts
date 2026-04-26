import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        NEXT_PUBLIC_VERSION: process.env.npm_package_version,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: '',
                    },
                ],
            },
        ]
    }
}

export default nextConfig