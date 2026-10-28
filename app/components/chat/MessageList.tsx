"use client";

import { useLayoutEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import Spinner from "../Spinner";
import type { ChatMessage } from "@/app/types/chat";

// Start loading older messages when the user scrolls this close to the top
const LOAD_OLDER_THRESHOLD_PX = 80;

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading: boolean;
  hasMore: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => void;
}

interface ScrollSnapshot {
  firstId?: string;
  lastId?: string;
  scrollHeight: number;
}

export default function MessageList({
  messages,
  currentUserId,
  isLoading,
  hasMore,
  isLoadingOlder,
  onLoadOlder,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<ScrollSnapshot | null>(null);

  // Runs before paint so the viewport never visibly jumps.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const firstId = messages[0]?._id;
    const lastId = messages[messages.length - 1]?._id;
    const prev = snapshotRef.current;

    if (prev && prev.lastId === lastId && prev.firstId !== firstId) {
      // Older messages were prepended: keep the user's place in the conversation
      el.scrollTop += el.scrollHeight - prev.scrollHeight;
    } else if (!prev || prev.lastId !== lastId) {
      // First load jumps straight to the bottom; new messages scroll smoothly
      el.scrollTo({ top: el.scrollHeight, behavior: prev?.lastId ? "smooth" : "auto" });
    }

    snapshotRef.current = { firstId, lastId, scrollHeight: el.scrollHeight };
  }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (el && el.scrollTop < LOAD_OLDER_THRESHOLD_PX && hasMore && !isLoadingOlder) {
      onLoadOlder();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative"
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner className="w-8 h-8 border-4" />
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-muted">
          <p>No messages yet. Say hello!</p>
        </div>
      ) : (
        <>
          {hasMore && (
            <div className="flex justify-center">
              {isLoadingOlder ? (
                <Spinner className="w-5 h-5 border-2" />
              ) : (
                <button
                  onClick={onLoadOlder}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Load older messages
                </button>
              )}
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble key={message._id} message={message} isMine={message.senderId === currentUserId} />
          ))}
        </>
      )}
    </div>
  );
}
