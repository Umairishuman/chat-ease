// Client-side wrappers for the chat API routes. Each throws an Error carrying the
// server's `error` message when the request fails.

import type { Chat, ChatMessage, ChatUser, MessagesPage, SearchUser } from "@/app/types/chat";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export async function fetchCurrentUser(): Promise<ChatUser> {
  const data = await request<{ user: ChatUser }>("/api/auth/me");
  return data.user;
}

export async function logout(): Promise<void> {
  await request("/api/auth/logout", { method: "POST" });
}

export async function searchUsers(query: string): Promise<SearchUser[]> {
  const data = await request<{ users?: SearchUser[] }>(`/api/user/search?q=${encodeURIComponent(query)}`);
  return data.users ?? [];
}

export async function fetchChats(): Promise<Chat[]> {
  const data = await request<{ chats?: Chat[] }>("/api/chats");
  return data.chats ?? [];
}

export async function createChat(participantId: string): Promise<Chat> {
  const data = await request<{ chat: Chat }>("/api/chats", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ participantId }),
  });
  return data.chat;
}

// Loads a page of messages, oldest first. Pass `cursor` (the oldest loaded message id) to load older ones.
export async function fetchMessagesPage(chatId: string, cursor?: string): Promise<MessagesPage> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  return request<MessagesPage>(`/api/chats/${chatId}/messages${query}`);
}

export async function sendChatMessage(chatId: string, content: string): Promise<ChatMessage> {
  const data = await request<{ message: ChatMessage }>(`/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ content }),
  });
  return data.message;
}

export async function markChatRead(chatId: string): Promise<void> {
  await request(`/api/chats/${chatId}/read`, { method: "PUT" });
}
