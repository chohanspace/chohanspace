import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/data';
import { database } from '@/lib/firebase';
import { ref, get, query } from 'firebase/database';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

async function getBlogPosts(): Promise<BlogPost[]> {
    if (!database) return [];
    const postsRef = ref(database, 'blogPosts');
    const dbQuery = query(postsRef);

    try {
        const snapshot = await get(dbQuery);
        if (snapshot.exists()) {
            const postsData = snapshot.val();
            // Firebase returns an object. We convert it to an array and sort descending by date.
            return Object.values(postsData as Record<string, BlogPost>)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return [];
    } catch (error) {
        console.error("Error fetching blog posts from Firebase:", error);
        return [];
    }
}


export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">From the Dev Log</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Insights, tutorials, and stories from our team of developers.
        </p>
      </div>

      {blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-48 w-full">
                        <Image src={post.image} alt={post.title} fill className="object-cover" data-ai-hint={post.dataAiHint} />
                    </div>
                </Link>
                <CardHeader>
                <CardTitle>
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
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
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No Posts Yet</h2>
            <p className="text-muted-foreground">Check back soon for updates from our team!</p>
        </div>
      )}
    </div>
  );
}
