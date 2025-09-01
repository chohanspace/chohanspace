
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { database } from '@/lib/firebase';
import { ref, get, query } from 'firebase/database';
import { SubmissionList } from './SubmissionList';
import type { BlogPost } from '@/lib/data';
import BlogManagementList from './BlogManagementList';
import { AddNewPost } from './AddNewPost';

export type Submission = {
    name: string;
    email: string;
    message: string;
    id: string;
};

function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        if (!database) {
            setError('Firebase is not configured. Please check your environment variables.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const submissionsRef = ref(database, 'submissions');
            const postsRef = ref(database, 'blogPosts');

            const [submissionsSnapshot, postsSnapshot] = await Promise.all([
                get(query(submissionsRef)),
                get(query(postsRef))
            ]);

            if (submissionsSnapshot.exists()) {
                const submissionsData = submissionsSnapshot.val();
                const submissionsList = Object.entries(submissionsData).map(([key, value]) => ({
                    id: key,
                    ...(value as Omit<Submission, 'id'>)
                })).reverse();
                setSubmissions(submissionsList);
            } else {
                setSubmissions([]);
            }

            if (postsSnapshot.exists()) {
                const postsData = postsSnapshot.val();
                const postsList = Object.values(postsData as Record<string, BlogPost>)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setPosts(postsList);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Failed to fetch dashboard data.');
            toast({
                title: 'Error',
                description: 'Failed to fetch dashboard data.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="container mx-auto px-4 py-12 animate-fadeIn">
             <div className="flex justify-between items-center mb-12">
                <div className="text-left">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-muted-foreground">Manage your site content</p>
                </div>
                <AdminLogoutButton />
            </div>

            {isLoading ? (
                 <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-destructive">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="grid gap-12">
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Blog Posts</h2>
                            <AddNewPost onPostCreated={fetchData} />
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Blog Posts</CardTitle>
                                <CardDescription>
                                    {posts.length > 0 ? `Showing ${posts.length} post(s).` : 'No blog posts yet.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BlogManagementList initialPosts={posts} onPostDeleted={fetchData} />
                            </CardContent>
                        </Card>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Contact Form Submissions</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>Submissions</CardTitle>
                                <CardDescription>
                                    {submissions.length > 0 ? `Showing ${submissions.length} message(s).` : 'No submissions yet.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubmissionList initialSubmissions={submissions} />
                            </CardContent>
                        </Card>
                    </section>
                </div>
            )}
        </div>
    );
}
