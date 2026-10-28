// Client-side shapes of the JSON returned by the API routes.

export interface ChatUser {
  _id: string;
  name: string;
  handle: string;
  email: string;
  avatar?: string;
}

export type MessageStatus = "sent" | "delivered" | "read";

export interface ChatMessage {
  _id: string;
  chatId?: string;
  senderId: string;
  content: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage | null;
  unreadCounts?: Record<string, number>;
  updatedAt?: string;
}

export interface MessagesPage {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

// Result item from GET /api/user/search
export interface SearchUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
}

// Payload of the Socket.io `receive_message` event
export interface ReceiveMessageEvent {
  chatId: string;
  message: ChatMessage;
}
