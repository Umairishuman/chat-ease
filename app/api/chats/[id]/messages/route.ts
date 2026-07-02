import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import Chat from '@/app/models/Chat';
import User from '@/app/models/User';
import Message from '@/app/models/Message';
import { getAuthenticatedUser } from '../../../lib/serverAuth';
import mongoose from 'mongoose';

// GET /api/chats/[id]/messages
// Fetch messages for a specific chat with pagination
export async function GET(
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

        const url = new URL(req.url);
        // cursor is the ID of the oldest message currently loaded on the client
        const cursor = url.searchParams.get('cursor');
        const limit = parseInt(url.searchParams.get('limit') || '50');

        await connectDB();

        // Verify user is part of the chat
        const chat = await Chat.findOne({ _id: chatId, participants: user.userId });
        if (!chat) {
             return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 404 });
        }

        let query: any = { chatId };
        
        if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
             query._id = { $lt: cursor };
        }

        // Fetch messages, sorted by descending ID (newest first for pagination logic)
        const messages = await Message.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        // We usually want to send messages oldest-first to the client for rendering
        // so we reverse the array before sending it back
        const sortedMessages = messages.reverse();

        const nextCursor = sortedMessages.length > 0 ? sortedMessages[0]._id : null;
        const hasMore = messages.length === limit;

        return NextResponse.json({ 
            messages: sortedMessages, 
            nextCursor,
            hasMore
        }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch messages error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/chats/[id]/messages
// Send a new message
export async function POST(
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

        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string' || content.trim() === '') {
             return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
        }

        await connectDB();

        // Verify user is part of the chat
        const chat = await Chat.findOne({ _id: chatId, participants: user.userId });
        if (!chat) {
             return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 404 });
        }

        // Create the message
        const message = await Message.create({
            chatId,
            senderId: user.userId,
            content: content.trim(),
            status: 'sent'
        });

        // Update the chat's lastMessage and unreadCounts
        // Increment unread count for everyone except the sender
        const unreadCounts = chat.unreadCounts || new Map();
        chat.participants.forEach((participantId: mongoose.Types.ObjectId) => {
            const pIdStr = participantId.toString();
            if (pIdStr !== user.userId) {
                const currentCount = unreadCounts.get(pIdStr) || 0;
                unreadCounts.set(pIdStr, currentCount + 1);
            }
        });

        chat.lastMessage = message._id;
        chat.unreadCounts = unreadCounts;
        await chat.save();

        return NextResponse.json({ message }, { status: 201 });

    } catch (error: any) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
