import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { createSession } from '../../lib/serverAuth';
import { RATE_LIMITS, clearRateLimit, getClientIp, rateLimitAll, tooManyRequests } from '../../lib/rateLimit';

export async function POST(req: Request) {
    try {
        const { email, password, rememberMe } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const ip = getClientIp(req);
        const accountKey = `login:account:${ip}:${String(email).trim().toLowerCase()}`;
        const limit = rateLimitAll([
            { key: accountKey, rule: RATE_LIMITS.loginPerAccount },
            { key: `login:ip:${ip}`, rule: RATE_LIMITS.loginPerIp },
        ]);
        if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.password) {
            return NextResponse.json({ error: 'This account uses Google Sign-In. Please sign in with Google.' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // A successful login resets the per-account attempt counter
        clearRateLimit(accountKey);

        await createSession({ userId: user._id.toString(), email: user.email }, Boolean(rememberMe));

        // Omit password from user object
        const userObj = user.toObject();
        delete userObj.password;

        return NextResponse.json({ message: 'Login successful', user: userObj }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
