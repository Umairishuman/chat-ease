"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchMessagesPage } from "@/app/(pages)/lib/api";
import { getErrorMessage } from "@/app/(pages)/lib/errors";
import type { ChatMessage } from "@/app/types/chat";

// Messages of one chat, loaded newest page first, with older pages loaded on demand.
// Mount the consumer with `key={chatId}` so switching chats starts from a clean state.
export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  // Guards against scroll events firing several requests before state updates
  const loadingOlderRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetchMessagesPage(chatId)
      .then((page) => {
        if (cancelled) return;
        setMessages(page.messages);
        setHasMore(page.hasMore);
      })
      .catch((err) => {
        if (!cancelled) toast.error(getErrorMessage(err, "Failed to load messages"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [chatId]);

  const loadOlder = useCallback(async () => {
    const oldest = messages[0];
    if (!hasMore || !oldest || loadingOlderRef.current) return;

    loadingOlderRef.current = true;
    setIsLoadingOlder(true);
    try {
      const page = await fetchMessagesPage(chatId, oldest._id);
      setMessages((prev) => [...page.messages, ...prev]);
      setHasMore(page.hasMore);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load older messages"));
    } finally {
      loadingOlderRef.current = false;
      setIsLoadingOlder(false);
    }
  }, [chatId, hasMore, messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
  }, []);

  const replaceMessage = useCallback((id: string, message: ChatMessage) => {
    setMessages((prev) => prev.map((m) => (m._id === id ? message : m)));
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== id));
  }, []);

  return { messages, isLoading, hasMore, isLoadingOlder, loadOlder, addMessage, replaceMessage, removeMessage };
}
