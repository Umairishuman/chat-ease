import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JOSE_SECRET || 'fallback-secret-key-12345');
const REMEMBER_ME_EXPIRATION = process.env.REMEMBER_ME_EXPIRATION || '30d';
const DEFAULT_SESSION_EXPIRATION = process.env.DEFAULT_SESSION_EXPIRATION || '1d';

export async function POST(req: Request) {
    try {
        const { email, password, rememberMe } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

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

        // Generate JWT
        const expirationString = rememberMe ? REMEMBER_ME_EXPIRATION : DEFAULT_SESSION_EXPIRATION;
        
        // Compute numeric seconds for the cookie Max-Age
        let maxAgeSeconds = 24 * 60 * 60; // default 1 day
        if (expirationString === '30d') {
            maxAgeSeconds = 30 * 24 * 60 * 60;
        }

        const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expirationString)
            .sign(SECRET);

        // Set the cookie securely
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'session_token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: maxAgeSeconds,
            sameSite: 'lax',
        });

        // Omit password from user object
        const userObj = user.toObject();
        delete userObj.password;

        return NextResponse.json({ message: 'Login successful', user: userObj }, { status: 200 });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
