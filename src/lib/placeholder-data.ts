
import type { Project } from './data';

export const placeholderProjects: Project[] = [
  {
    slug: 'e-commerce-platform',
    title: 'E-commerce Platform',
    description: 'A robust online store with a custom CMS and payment gateway integration, designed for a seamless user experience.',
    image: 'https://picsum.photos/seed/ecom/600/400',
    dataAiHint: 'online store',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Firebase'],
  },
  {
    slug: 'corporate-website',
    title: 'Corporate Website',
    description: 'A professional and modern corporate website with a focus on brand identity and lead generation.',
    image: 'https://picsum.photos/seed/corp/600/400',
    dataAiHint: 'business website',
    tags: ['React', 'Tailwind CSS', 'CMS'],
  },
  {
    slug: 'booking-app',
    title: 'Service Booking App',
    description: 'A web application that allows users to book appointments, manage schedules, and process payments.',
    image: 'https://picsum.photos/seed/booking/600/400',
    dataAiHint: 'calendar app',
    tags: ['Next.js', 'Firebase', 'Google Calendar API'],
  },
  {
    slug: 'portfolio-site',
    title: 'Creative Portfolio',
    description: 'A visually stunning portfolio website for a creative professional, highlighting their work with elegant animations.',
    image: 'https://picsum.photos/seed/portfolio/600/400',
    dataAiHint: 'artist portfolio',
    tags: ['React', 'Framer Motion', 'Headless CMS'],
  },
  {
    slug: 'blog-platform',
    title: 'Blogging Platform',
    description: 'A feature-rich blogging platform with markdown support, comments, and a custom admin dashboard.',
    image: 'https://picsum.photos/seed/blog/600/400',
    dataAiHint: 'writing journal',
    tags: ['Next.js', 'Firebase', 'Realtime Database'],
  },
  {
    slug: 'social-media-dashboard',
    title: 'Social Media Dashboard',
    description: 'An analytics dashboard for social media managers to track engagement and performance across multiple platforms.',
    image: 'https://picsum.photos/seed/dashboard/600/400',
    dataAiHint: 'analytics chart',
    tags: ['React', 'D3.js', 'API Integration'],
  },
];
