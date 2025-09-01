
import type { BlogPost } from '@/lib/data';
import { database } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo, limitToFirst } from 'firebase/database';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

async function getPost(slug: string): Promise<BlogPost | null> {
    if (!database) return null;
    const postsRef = ref(database, 'blogPosts');
    
    try {
        const snapshot = await get(postsRef);
        if (snapshot.exists()) {
            const postsData = snapshot.val();
            // Find the post with the matching slug
            const post = Object.values(postsData as Record<string, BlogPost>).find(p => p.slug === slug);
            return post || null;
        }
        return null;
    } catch (error) {
        console.error("Error fetching single post:", error);
        return null;
    }
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="mb-8">
            <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
            </Link>
        </div>
      <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image src={post.image} alt={post.title} fill className="object-cover" data-ai-hint={post.dataAiHint} priority />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4">{post.title}</h1>
        <div className="text-muted-foreground text-sm">
          <span>By {post.author}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      <div className="prose dark:prose-invert prose-lg max-w-none text-foreground/90 whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  if (!database) return [];
  const postsRef = ref(database, 'blogPosts');
  try {
    const snapshot = await get(query(postsRef));
    if (snapshot.exists()) {
      const postsData = snapshot.val();
      return Object.values(postsData as Record<string, BlogPost>).map((post) => ({
        slug: post.slug,
      }));
    }
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
  }
  return [];
}
