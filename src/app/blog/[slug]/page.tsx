
import type { BlogPost } from '@/lib/data';
import { getDb } from '@/lib/mongodb';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BlogPostPageProps = {
  params?: Promise<{ slug: string }>;
};

async function getPost(slug: string): Promise<BlogPost | null> {
    const db = await getDb();
    const post = await db.collection('blogPosts').findOne({ slug });

    if (!post) {
      return null;
    }

    return {
      id: typeof post.id === 'string' ? post.id : post._id.toString(),
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      content: post.content,
      author: post.author,
      date: post.date,
      image: post.image,
      dataAiHint: post.dataAiHint ?? '',
    };
}


export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolved = params ? await params : undefined;
  const { slug } = resolved as { slug: string };
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="px-3 py-10 md:px-4 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>
        </div>

        <div className="section-shell overflow-hidden p-4 md:p-6">
          <div className="relative mb-6 h-64 overflow-hidden rounded-[24px] md:h-96">
            <Image src={post.image} alt={post.title} fill className="object-cover" data-ai-hint={post.dataAiHint} priority />
          </div>

          <header className="mb-8 px-2 md:px-4">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/50 bg-white/70 px-3 py-1 text-sm text-foreground/80 backdrop-blur dark:border-white/10 dark:bg-white/10">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] md:text-5xl">{post.title}</h1>
            <div className="mt-4 text-sm text-muted-foreground">
              <span>By {post.author}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none whitespace-pre-wrap text-foreground/90 dark:prose-invert md:px-4">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}

