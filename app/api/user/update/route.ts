import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import { getAuthenticatedUser } from '../../lib/serverAuth';

interface ProfileUpdate {
    name: string;
    handle: string;
    avatar?: string;
}

export async function PUT(req: Request) {
    try {
        const session = await getAuthenticatedUser();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { name, handle, avatar } = await req.json();

        if (!name || !handle) {
            return NextResponse.json({ error: 'Name and handle are required' }, { status: 400 });
        }

        await connectDB();

        // Check if handle is taken by another user
        const existingHandle = await User.findOne({ handle, _id: { $ne: session.userId } });
        if (existingHandle) {
            return NextResponse.json({ error: 'This handle is already taken' }, { status: 400 });
        }

        const updateData: ProfileUpdate = { name, handle };
        if (avatar) {
            updateData.avatar = avatar;
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
