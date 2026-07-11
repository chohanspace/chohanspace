import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/data';
import { getDb } from '@/lib/mongodb';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

async function getBlogPosts(): Promise<BlogPost[]> {
    const db = await getDb();
    const posts = await db.collection('blogPosts').find().sort({ date: -1 }).toArray();

    return posts.map((post) => ({
        slug: post.slug,
        id: typeof post.id === 'string' ? post.id : post._id.toString(),
        title: post.title,
        summary: post.summary,
        content: post.content,
        author: post.author,
        date: post.date,
        image: post.image,
        dataAiHint: post.dataAiHint ?? '',
    }));
}


export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="px-3 py-10 md:px-4 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="section-shell px-6 py-10 text-center md:px-10 md:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Journal</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">From the dev log</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Insights, product thinking, and practical lessons from the team behind thoughtful digital experiences.
            </p>
          </div>
        </div>

        {blogPosts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 w-full">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">By {post.author} on {new Date(post.date).toLocaleDateString()}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0">
                    <Link href={`/blog/${post.slug}`}>
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="section-shell mt-8 px-6 py-20 text-center">
            <h2 className="mb-4 text-2xl font-semibold">No posts yet</h2>
            <p className="text-muted-foreground">Check back soon for updates from our team.</p>
          </div>
        )}
      </div>
    </div>
  );
}