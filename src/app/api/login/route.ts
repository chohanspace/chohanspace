
import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    console.error('Missing ADMIN_PASSWORD or JWT_SECRET environment variables');
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  if (password === adminPassword) {
    // Password is correct. Generate a short-lived "pre-auth" token.
    // This token proves that the password step has been completed.
    const preAuthToken = jwt.sign({ passwordVerified: true }, jwtSecret, { expiresIn: '5m' });
    
    const emailOptions = [
        'abdullahchohan6900@gmail.com',
        'abdullahchohan5pansy@gmail.com'
    ];

    return NextResponse.json({ 
        success: true, 
        preAuthToken,
        emailOptions
    });
  } else {
    return new NextResponse('Invalid password', { status: 401 });
  }
}
