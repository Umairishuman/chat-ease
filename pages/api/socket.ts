import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import mongoose from 'mongoose';
import connectDB from '@/app/(pages)/lib/db';
import Chat from '@/app/models/Chat';
import Message from '@/app/models/Message';
import { getSessionTokenFromCookieHeader, verifySessionToken } from '@/app/api/lib/session';

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

interface SendMessagePayload {
  chatId?: string;
  message?: { _id?: string };
}

const isValidId = (id: unknown): id is string =>
  typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new ServerIO(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  // Only allow connections that carry a valid session cookie.
  io.use(async (socket, next) => {
    try {
      const token = getSessionTokenFromCookieHeader(socket.request.headers.cookie);
      const session = token ? await verifySessionToken(token) : null;
      if (!session) {
        next(new Error('Not authenticated'));
        return;
      }
      socket.data.userId = session.userId;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Not authenticated'));
    }
  });

  io.on('connection', (socket) => {
    const userId: string = socket.data.userId;
    // One room per user, so every open tab/device receives the user's messages.
    socket.join(userId);

    // Relay a message that was already persisted via POST /api/chats/[id]/messages.
    // The message is re-read from the database so clients cannot spoof content or senders.
    socket.on('send_message', async (data: SendMessagePayload) => {
      try {
        const chatId = data?.chatId;
        const messageId = data?.message?._id;
        if (!isValidId(chatId) || !isValidId(messageId)) return;

        await connectDB();

        const chat = await Chat.findOne({ _id: chatId, participants: userId }).lean<{ participants: mongoose.Types.ObjectId[] }>();
        if (!chat) return;

        const message = await Message.findOne({ _id: messageId, chatId, senderId: userId }).lean();
        if (!message) return;

        for (const participantId of chat.participants) {
          const recipientId = participantId.toString();
          if (recipientId !== userId) {
            io.to(recipientId).emit('receive_message', { message, chatId });
          }
        }
      } catch (error) {
        console.error('Socket send_message error:', error);
      }
    });
  });

  res.end();
}
