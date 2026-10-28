import type { Chat, ChatUser } from "@/app/types/chat";

type AvatarUser = Pick<ChatUser, "avatar" | "email"> | null | undefined;

// Falls back to a generated avatar when the user has not uploaded one.
export function getAvatarUrl(user: AvatarUser): string {
  return user?.avatar || `https://i.pravatar.cc/150?u=${user?.email}`;
}

export function getOtherParticipant(chat: Chat, currentUserId: string | undefined): ChatUser | undefined {
  return chat.participants.find((p) => p._id !== currentUserId) || chat.participants[0];
}

export function getUnreadCount(chat: Chat, currentUserId: string | undefined): number {
  if (!currentUserId) return 0;
  return chat.unreadCounts?.[currentUserId] || 0;
}

export function formatMessageTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
