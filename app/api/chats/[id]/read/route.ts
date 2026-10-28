import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import Chat from '@/app/models/Chat';
import { getAuthenticatedUser } from '../../../lib/serverAuth';
import mongoose from 'mongoose';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: chatId } = await params;
        const user = await getAuthenticatedUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
             return NextResponse.json({ error: 'Invalid chat ID' }, { status: 400 });
        }

        await connectDB();

        const chat = await Chat.findOne({ _id: chatId, participants: user.userId });
        if (!chat) {
             return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        // Reset unread count for the current user
        if (chat.unreadCounts) {
            chat.unreadCounts.set(user.userId, 0);
            await chat.save();
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Mark read error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
