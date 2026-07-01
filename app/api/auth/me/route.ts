import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JOSE_SECRET || 'fallback-secret-key-12345');

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        let payload;
        try {
            const verified = await jwtVerify(token, SECRET);
            payload = verified.payload;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(payload.userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error: any) {
        console.error('Me route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
