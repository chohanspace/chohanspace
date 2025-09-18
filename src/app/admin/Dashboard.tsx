
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
import type { BlogPost, Ticket, Submission } from '@/lib/data';
import BlogManagementList from './BlogManagementList';
import { AddNewPost } from './AddNewPost';
import { TicketManagement } from './TicketManagement';
import { Skeleton } from '@/components/ui/skeleton';

function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}

type DashboardProps = {
    initialSubmissions: Submission[],
    initialPosts: BlogPost[],
    initialTickets: Ticket[],
    serverError?: string,
}

function DashboardSkeleton() {
    return (
        <div className="grid gap-12">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </section>
             <section>
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-40" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                         <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
            </section>
            <section>
                 <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-72" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}


export default function AdminDashboard({ initialSubmissions, initialPosts, initialTickets, serverError }: DashboardProps) {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(serverError || null);
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!database) {
                throw new Error('Firebase is not configured.');
            }
            const submissionsRef = ref(database, 'submissions');
            const postsRef = ref(database, 'blogPosts');
            const ticketsRef = ref(database, 'tickets');

            const [submissionsSnapshot, postsSnapshot, ticketsSnapshot] = await Promise.all([
                get(query(submissionsRef)),
                get(query(postsRef)),
                get(query(ticketsRef))
            ]);

            if (submissionsSnapshot.exists()) {
                const submissionsData = submissionsSnapshot.val();
                setSubmissions(Object.entries(submissionsData).map(([key, value]) => ({
                    id: key,
                    ...(value as Omit<Submission, 'id'>)
                })).reverse());
            } else {
                setSubmissions([]);
            }

            if (postsSnapshot.exists()) {
                const postsData = postsSnapshot.val();
                setPosts(Object.values(postsData as Record<string, BlogPost>)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } else {
                setPosts([]);
            }
            
            if (ticketsSnapshot.exists()) {
                const ticketsData = ticketsSnapshot.val();
                 setTickets(Object.values(ticketsData as Record<string, Ticket>)
                    .map((ticket, index) => ({ ...ticket, id: Object.keys(ticketsData)[index] }))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setTickets([]);
            }
        } catch (fetchError) {
            const errorMessage = fetchError instanceof Error ? fetchError.message : 'An unknown error occurred.';
            console.error("Error fetching data:", fetchError);
            setError(`Failed to refresh dashboard data: ${errorMessage}`);
            toast({
                title: 'Error',
                description: `Failed to refresh dashboard data.`,
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
                <div className="flex items-center gap-2">
                    {!isLoading && <AdminLogoutButton />}
                </div>
            </div>

            {error ? (
                <div className="text-center py-12 text-destructive">
                    <p>{error}</p>
                </div>
            ) : isLoading ? (
                <DashboardSkeleton />
            ) : (
                <div className="grid gap-12">
                    <section>
                        <TicketManagement initialTickets={tickets} onTicketChange={fetchData} />
                    </section>
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
