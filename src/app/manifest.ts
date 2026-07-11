import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chohan Space',
    short_name: 'Chohan Space',
    description: 'Premium web experiences crafted with strategy, design, and engineering.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070B',
    theme_color: '#05070B',
    icons: [
      {
        src: '/choran-space-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
