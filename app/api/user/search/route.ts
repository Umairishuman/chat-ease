import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import { getAuthenticatedUser } from '../../lib/serverAuth';

// Escape user input so it is matched literally (prevents regex injection / ReDoS).
function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: Request) {
    try {
        const session = await getAuthenticatedUser();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.trim() === '') {
            return NextResponse.json({ users: [] }, { status: 200 });
        }

        await connectDB();

        const pattern = new RegExp(escapeRegex(query.trim().slice(0, 100)), 'i');

        // Search by handle, email, or name. Exclude the current user.
        const users = await User.find({
            _id: { $ne: session.userId },
            $or: [
                { handle: pattern },
                { email: pattern },
                { name: pattern }
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

    } catch (error) {
        console.error('User search error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
