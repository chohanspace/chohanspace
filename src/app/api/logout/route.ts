import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the authentication cookie
  cookies().set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0), // Set to a past date to expire immediately
    path: '/',
    sameSite: 'strict',
  });

  return new NextResponse('Logout successful', { status: 200 });
}
