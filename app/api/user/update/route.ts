import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JOSE_SECRET || 'fallback-secret-key-12345');

export async function PUT(req: Request) {
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

        const { name, handle } = await req.json();

        if (!name || !handle) {
            return NextResponse.json({ error: 'Name and handle are required' }, { status: 400 });
        }

        await connectDB();

        // Check if handle is taken by another user
        const existingHandle = await User.findOne({ handle, _id: { $ne: payload.userId } });
        if (existingHandle) {
            return NextResponse.json({ error: 'This handle is already taken' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            payload.userId,
            { name, handle },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser }, { status: 200 });

    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
