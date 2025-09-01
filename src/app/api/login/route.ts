import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    console.error('Missing ADMIN_PASSWORD or JWT_SECRET environment variables');
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  if (password === adminPassword) {
    const token = jwt.sign({ user: 'admin' }, jwtSecret, { expiresIn: '1h' });

    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'strict',
    });
    
    // Send a success response. The client will handle the redirect.
    return new NextResponse(JSON.stringify({ success: true }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
    });
  } else {
    return new NextResponse('Invalid password', { status: 401 });
  }
}
