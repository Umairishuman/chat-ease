"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import type { Socket } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatMessages } from "@/app/hooks/useChatMessages";
import { sendChatMessage } from "@/app/(pages)/lib/api";
import { getErrorMessage } from "@/app/(pages)/lib/errors";
import type { ChatMessage, ChatUser, ReceiveMessageEvent } from "@/app/types/chat";

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  otherUser: ChatUser;
  socket: Socket | null;
  onMessageSent: () => void;
}

// Render with `key={chatId}` so each conversation gets fresh message state.
export default function ChatWindow({ chatId, currentUserId, otherUser, socket, onMessageSent }: ChatWindowProps) {
  const { messages, isLoading, hasMore, isLoadingOlder, loadOlder, addMessage, replaceMessage, removeMessage } =
    useChatMessages(chatId);

  // Append live messages for this conversation
  useEffect(() => {
    if (!socket) return;
    const handleReceive = ({ chatId: incomingChatId, message }: ReceiveMessageEvent) => {
      if (incomingChatId === chatId) addMessage(message);
    };
    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket, chatId, addMessage]);

  const handleSend = async (content: string) => {
    // Optimistic message, swapped for the saved one once the server responds
    const tempMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      chatId,
      senderId: currentUserId,
      content,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    addMessage(tempMessage);

    try {
      const saved = await sendChatMessage(chatId, content);
      replaceMessage(tempMessage._id, saved);
      socket?.emit("send_message", { chatId, message: saved });
      onMessageSent();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
      removeMessage(tempMessage._id);
    }
  };

  return (
    <>
      <ChatHeader user={otherUser} />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingOlder={isLoadingOlder}
        onLoadOlder={loadOlder}
      />
      <MessageInput placeholder={`Message ${otherUser.handle || "friend"}...`} onSend={handleSend} />
    </>
  );
}
