
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
  
  // The /admin page now handles its own authentication check.
  // This middleware is kept to protect potential future nested admin routes
  // (e.g. /admin/settings) if they are ever created.
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not set');
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!token || !(await verifyToken(token, jwtSecret))) {
      // If no token or token is invalid, redirect to the main admin page
      // which will show the login form.
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
