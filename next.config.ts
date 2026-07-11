import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack(config, { isServer }) {
    if (isServer) {
      const externalModules = [
        'genkit',
        '@genkit-ai/googleai',
        '@genkit-ai/next',
      ];

      config.externals = [
        ...(config.externals || []),
        ...externalModules,
      ];
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-6d8ed6ce9591489c885eda64cf2ea10f.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;