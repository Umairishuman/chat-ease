import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import { getAuthenticatedUser } from '../../lib/serverAuth';

export async function GET() {
    try {
        const session = await getAuthenticatedUser();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error('Me route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
