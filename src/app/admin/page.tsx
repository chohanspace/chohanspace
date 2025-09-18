
import { cookies } from 'next/headers';
import * as jose from 'jose';
import AdminDashboard from './Dashboard';
import AdminLoginPage from './LoginPage';
import type { BlogPost, Ticket, Submission } from '@/lib/data';


async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
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
    
    // Data will now be fetched on the client side in AdminDashboard
    return (
       <AdminDashboard 
        initialSubmissions={[]}
        initialPosts={[]}
        initialTickets={[]}
       />
    );
}
