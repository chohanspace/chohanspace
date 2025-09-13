
import { database } from '@/lib/firebase';
import { ref, get, query } from 'firebase/database';
import type { BlogPost, Ticket, Submission } from '@/lib/data';
import AdminDashboard from './Dashboard';

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
            posts = Object.values(postsData as Record<string, BlogPost>)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        
        let tickets: Ticket[] = [];
        if (ticketsSnapshot.exists()) {
            const ticketsData = ticketsSnapshot.val();
            tickets = Object.values(ticketsData as Record<string, Ticket>)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return { submissions, posts, tickets };

    } catch (error) {
        console.error("Error fetching dashboard data on server:", error);
        // Return empty arrays on error so the page can still render.
        // The client component can show a more specific error message.
        return { submissions: [], posts: [], tickets: [], error: 'Failed to fetch dashboard data.' };
    }
}


export default async function AdminPage() {
    const { submissions, posts, tickets, error } = await getDashboardData();

    return (
       <AdminDashboard 
        initialSubmissions={submissions}
        initialPosts={posts}
        initialTickets={tickets}
        serverError={error}
       />
    );
}
