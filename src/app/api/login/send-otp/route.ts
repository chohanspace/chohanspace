
import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
    const { email, preAuthToken } = await req.json();
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return new NextResponse('Server configuration error.', { status: 500 });
    }

    if (!email || !preAuthToken) {
        return new NextResponse('Missing email or token.', { status: 400 });
    }
    
    // Whitelist emails
    const allowedEmails = ['abdullahchohan6900@gmail.com', 'abdullahchohan5pansy@gmail.com', 'abdullah@chohanestate.com'];
    if (!allowedEmails.includes(email)) {
        return new NextResponse('Invalid email address.', { status: 400 });
    }

    try {
        // Verify the pre-auth token from the password step
        jwt.verify(preAuthToken, jwtSecret);
    } catch (error) {
        return new NextResponse('Invalid or expired session.', { status: 401 });
    }
    
    const otp = generateOtp();
    const otpToken = jwt.sign({ otp, email, otpVerified: false }, jwtSecret, { expiresIn: '5m' });

    try {
        await sendEmail({
            to: email,
            subject: 'Your Admin Login OTP',
            text: `Your one-time password is: ${otp}. It will expire in 5 minutes.`,
            html: `<p>Your one-time password is: <strong>${otp}</strong>.</p><p>It will expire in 5 minutes.</p>`,
        });

        return NextResponse.json({ success: true, otpToken });
    } catch (error) {
        console.error("OTP email sending failed:", error);
        return new NextResponse('Failed to send OTP email.', { status: 500 });
    }
}
