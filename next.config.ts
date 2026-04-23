import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    reactCompiler: true,

    turbopack: {
        root: path.resolve(__dirname),
    },

    rewrites: async () => [
        {
            source: '/:api*',
            destination: process.env.NEXT_BACKEND_URL + '/:api*',
        },
    ],
};

export default nextConfig;
