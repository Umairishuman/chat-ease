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

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.trim() === '') {
            return NextResponse.json({ users: [] }, { status: 200 });
        }

        await connectDB();

        // Search by handle, email, or name. Exclude the current user.
        const users = await User.find({
            _id: { $ne: payload.userId },
            $or: [
                { handle: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        })
        .select('name handle avatar email')
        .limit(10);

        // Map `_id` to `id` for consistency in frontend
        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            handle: user.handle,
            email: user.email,
            avatar: user.avatar || 'https://i.pravatar.cc/150' // fallback if empty
        }));

        return NextResponse.json({ users: formattedUsers }, { status: 200 });

    } catch (error: any) {
        console.error('User search error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
