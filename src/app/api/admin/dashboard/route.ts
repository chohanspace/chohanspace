import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const db = await getDb();

  const [submissions, posts, tickets] = await Promise.all([
    db.collection('submissions').find().sort({ createdAt: -1 }).toArray(),
    db.collection('blogPosts').find().sort({ date: -1 }).toArray(),
    db.collection('tickets').find().sort({ createdAt: -1 }).toArray(),
  ]);

  return NextResponse.json({
    submissions: submissions.map((submission) => ({
      id: submission._id.toString(),
      name: submission.name,
      email: submission.email,
      message: submission.message,
      createdAt: submission.createdAt,
    })),
    posts: posts.map((post) => ({
      ...post,
      id: typeof post.id === 'string' ? post.id : post._id.toString(),
    })),
    tickets: tickets.map((ticket) => ({
      ...ticket,
      id: ticket.id ?? ticket._id.toString(),
    })),
  });
}
