import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const AUTH_COOKIE_NAME = 'auth_token';

async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not set');
      // Redirect to login as a safe default
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!token || !(await verifyToken(token, jwtSecret))) {
      // If no token or token is invalid, redirect to the login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/login') {
     const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
     const jwtSecret = process.env.JWT_SECRET;
     if (token && jwtSecret && (await verifyToken(token, jwtSecret))) {
        // If user is on login page but already has a valid token, redirect to admin
        return NextResponse.redirect(new URL('/admin', request.url));
     }
  }


  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
