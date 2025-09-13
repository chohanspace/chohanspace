
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { database } from '@/lib/firebase';
import { ref, get, query, orderByChild } from 'firebase/database';
import type { BlogPost, Ticket, Submission } from '@/lib/data';
import AdminDashboard from './Dashboard';
import AdminLoginPage from './LoginPage';

async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

async function getDashboardData() {
    if (!database) {
        throw new Error('Firebase is not configured. Please check your environment variables.');
    }

    try {
        const submissionsRef = ref(database, 'submissions');
        const postsRef = ref(database, 'blogPosts');
        const ticketsRef = ref(database, 'tickets');

        const [submissionsSnapshot, postsSnapshot, ticketsSnapshot] = await Promise.all([
            get(query(submissionsRef)),
            get(query(postsRef)),
            get(query(ticketsRef))
        ]);

        let submissions: Submission[] = [];
        if (submissionsSnapshot.exists()) {
            const submissionsData = submissionsSnapshot.val();
            submissions = Object.entries(submissionsData).map(([key, value]) => ({
                id: key,
                ...(value as Omit<Submission, 'id'>)
            })).reverse();
        }

        let posts: BlogPost[] = [];
        if (postsSnapshot.exists()) {
            const postsData = postsSnapshot.val();
            posts = Object.values(postsData as Record<string, Omit<BlogPost, 'id'>>)
                .map((post, index) => ({
                    ...post,
                    id: Object.keys(postsData)[index],
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        
        let tickets: Ticket[] = [];
        if (ticketsSnapshot.exists()) {
            const ticketsData = ticketsSnapshot.val();
            tickets = Object.values(ticketsData as Record<string, Ticket>)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return { submissions, posts, tickets, error: null };

    } catch (error) {
        console.error("Error fetching dashboard data on server:", error);
        return { submissions: [], posts: [], tickets: [], error: 'Failed to fetch dashboard data.' };
    }
}


export default async function AdminPage() {
    const token = cookies().get('auth_token')?.value;
    const jwtSecret = process.env.JWT_SECRET;
    let isAuthenticated = false;

    if (token && jwtSecret) {
        isAuthenticated = await verifyToken(token, jwtSecret);
    }
    
    if (!isAuthenticated) {
        return <AdminLoginPage />;
    }
    
    const { submissions, posts, tickets, error } = await getDashboardData();

    return (
       <AdminDashboard 
        initialSubmissions={submissions}
        initialPosts={posts}
        initialTickets={tickets}
        serverError={error || undefined}
       />
    );
}
