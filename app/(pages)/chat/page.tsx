"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SearchModal from "../../components/SearchModal";
import Spinner from "../../components/Spinner";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import EmptyChatState from "../../components/chat/EmptyChatState";
import { useChatSocket } from "@/app/hooks/useChatSocket";
import { createChat, fetchChats, fetchCurrentUser, logout, markChatRead } from "@/app/(pages)/lib/api";
import { getOtherParticipant } from "@/app/(pages)/lib/chat";
import { getErrorMessage } from "@/app/(pages)/lib/errors";
import type { Chat, ChatUser, ReceiveMessageEvent, SearchUser } from "@/app/types/chat";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();

  const currentUserId = currentUser?._id;
  const socket = useChatSocket(Boolean(currentUserId));

  const refreshChats = useCallback(async () => {
    try {
      setChats(await fetchChats());
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  }, []);

  const markChatAsRead = useCallback(async (chatId: string) => {
    if (currentUserId) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId
            ? { ...chat, unreadCounts: { ...chat.unreadCounts, [currentUserId]: 0 } }
            : chat
        )
      );
    }

    try {
      await markChatRead(chatId);
    } catch (err) {
      console.error("Failed to mark chat as read", err);
    }
  }, [currentUserId]);

  useEffect(() => {
    const loadUserAndChats = async () => {
      try {
        setCurrentUser(await fetchCurrentUser());
        await refreshChats();
      } catch (err) {
        console.error("Failed to fetch user", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUserAndChats();
  }, [router, refreshChats]);

  // Keep the sidebar (last message, unread counts) in sync with incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleReceive = async ({ chatId }: ReceiveMessageEvent) => {
      if (chatId === selectedChatId) {
        await markChatAsRead(chatId);
      }
      await refreshChats();
    };
    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket, selectedChatId, markChatAsRead, refreshChats]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId);
  };

  const handleStartChat = async (user: SearchUser) => {
    try {
      const chat = await createChat(user.id);
      await refreshChats();
      handleSelectChat(chat._id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to start chat"));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("An error occurred during logout");
    }
  };

  const activeChat = chats.find((chat) => chat._id === selectedChatId);
  const activeOtherParticipant = activeChat ? getOtherParticipant(activeChat, currentUserId) : undefined;

  if (loading || !currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-background font-sans">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative h-screen flex bg-background text-foreground font-sans overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Main Layout Container */}
      <div className="relative z-10 flex w-full h-full p-4 gap-4 backdrop-blur-3xl">
        <ChatSidebar
          currentUser={currentUser}
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full rounded-3xl backdrop-blur-xl bg-surface border border-border shadow-2xl overflow-hidden relative">
          {activeChat && activeOtherParticipant ? (
            <ChatWindow
              key={activeChat._id}
              chatId={activeChat._id}
              currentUserId={currentUser._id}
              otherUser={activeOtherParticipant}
              socket={socket}
              onMessageSent={refreshChats}
            />
          ) : (
            <EmptyChatState onStartChatting={() => setIsSearchModalOpen(true)} />
          )}
        </div>
      </div>

      {isSearchModalOpen && (
        <SearchModal
          onClose={() => setIsSearchModalOpen(false)}
          onSelectUser={handleStartChat}
        />
      )}
    </div>
  );
}
