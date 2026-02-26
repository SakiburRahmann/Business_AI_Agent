import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/services/notification-service';
import crypto from 'crypto';

const SECRET = process.env.RESEND_API_KEY || 'auth-verification-fallback-secret';

/**
 * Signs a payload to create a stateless verification token.
 */
function signToken(email: string, code: string, expires: number) {
    const data = `${email}:${code}:${expires}`;
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(data);
    return `${data}:${hmac.digest('hex')}`;
}

/**
 * Verifies a token against the provided code and email.
 */
function verifyToken(token: string, email: string, code: string) {
    try {
        const parts = token.split(':');
        if (parts.length !== 4) return false;

        const [tEmail, tCode, tExpires, tHmac] = parts;

        // Check integrity
        const data = `${tEmail}:${tCode}:${tExpires}`;
        const hmac = crypto.createHmac('sha256', SECRET);
        hmac.update(data);
        const expectedHmac = hmac.digest('hex');

        if (tHmac !== expectedHmac) return false;

        // Check data match
        if (tEmail !== email || tCode !== code) return false;

        // Check expiry
        if (Date.now() > parseInt(tExpires)) return false;

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * POST: Sends a 6-digit OTP via Resend.
 * Returns a stateless verification token.
 */
export async function POST(req: NextRequest) {
    try {
        const { email, firstName } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry (10 minutes)
        const expires = Date.now() + 10 * 60 * 1000;

        // Send email via Resend
        const notificationService = new NotificationService();
        await notificationService.sendVerificationCode(email, code, firstName || 'User');

        // Create signed token
        const verificationToken = signToken(email, code, expires);

        return NextResponse.json({
            success: true,
            token: verificationToken,
            message: 'Verification code sent'
        });
    } catch (error: any) {
        console.error('[OTP Send Error]:', error);
        return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
    }
}

/**
 * PUT: Verifies a code and token.
 */
export async function PUT(req: NextRequest) {
    try {
        const { email, code, token } = await req.json();

        if (!email || !code || !token) {
            return NextResponse.json({ error: 'Missing verification data' }, { status: 400 });
        }

        const isValid = verifyToken(token, email, code);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
