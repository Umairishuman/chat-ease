import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import Chat from '@/app/models/Chat';
import User from '@/app/models/User';
import Message from '@/app/models/Message';
import { getAuthenticatedUser } from '../lib/serverAuth';

export async function GET(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        // Find all chats where the user is a participant
        const chats = await Chat.find({ participants: user.userId })
            .populate({
                path: 'participants',
                select: 'name handle avatarUrl',
                model: User
            })
            .populate({
                path: 'lastMessage',
                model: Message
            })
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({ chats }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch chats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await req.json();
        const { participantId } = body;

        if (!participantId) {
            return NextResponse.json({ error: 'participantId is required' }, { status: 400 });
        }

        if (participantId === user.userId) {
            return NextResponse.json({ error: 'Cannot create a chat with yourself' }, { status: 400 });
        }

        await connectDB();

        // Check if a chat already exists between these two users
        // This query finds a chat that has exactly these two participants
        const existingChat = await Chat.findOne({
            participants: { $all: [user.userId, participantId], $size: 2 }
        })
        .populate({ path: 'participants', select: 'name handle avatarUrl', model: User })
        .populate({ path: 'lastMessage', model: Message });

        if (existingChat) {
            return NextResponse.json({ chat: existingChat }, { status: 200 });
        }

        // Check if the other user exists
        const otherUser = await User.findById(participantId);
        if (!otherUser) {
            return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
        }

        // Create new chat
        const newChat = await Chat.create({
            participants: [user.userId, participantId],
            unreadCounts: new Map([
                [user.userId, 0],
                [participantId, 0]
            ])
        });

        // Populate for response
        const populatedChat = await Chat.findById(newChat._id)
            .populate({ path: 'participants', select: 'name handle avatarUrl', model: User });

        return NextResponse.json({ chat: populatedChat }, { status: 201 });

    } catch (error: any) {
        console.error('Create chat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
