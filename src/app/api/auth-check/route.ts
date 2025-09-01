import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET() {
  const token = cookies().get('auth_token')?.value;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || !token) {
    return NextResponse.json({ authenticated: false });
  }

  const isAuthenticated = await verifyToken(token, jwtSecret);
  return NextResponse.json({ authenticated: isAuthenticated });
}
