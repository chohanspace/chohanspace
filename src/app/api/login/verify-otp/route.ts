
import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const { otp, otpToken } = await req.json();
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return new NextResponse('Server configuration error.', { status: 500 });
    }
    if (!otp || !otpToken) {
        return new NextResponse('Missing OTP or token.', { status: 400 });
    }
    
    try {
        const decoded = jwt.verify(otpToken, jwtSecret) as { otp: string, email: string };
        
        if (decoded.otp === otp) {
            // OTP is correct. Generate final auth token.
            const authToken = jwt.sign({ user: 'admin', email: decoded.email }, jwtSecret, { expiresIn: '1h' });

            cookies().set('auth_token', authToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60, // 1 hour
                path: '/',
                sameSite: 'strict',
            });
            
            return NextResponse.json({ success: true });
        } else {
            return new NextResponse('Invalid OTP.', { status: 401 });
        }
    } catch (error) {
        return new NextResponse('Invalid or expired OTP session.', { status: 401 });
    }
}
