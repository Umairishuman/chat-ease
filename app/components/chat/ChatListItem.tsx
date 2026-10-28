import Avatar from "../Avatar";
import { formatMessageTime, getAvatarUrl, getOtherParticipant, getUnreadCount } from "@/app/(pages)/lib/chat";
import type { Chat } from "@/app/types/chat";

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  isSelected: boolean;
  onSelect: (chatId: string) => void;
}

export default function ChatListItem({ chat, currentUserId, isSelected, onSelect }: ChatListItemProps) {
  const otherUser = getOtherParticipant(chat, currentUserId);
  const unreadCount = getUnreadCount(chat, currentUserId);

  return (
    <div
      onClick={() => onSelect(chat._id)}
      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${
        isSelected
          ? "bg-primary-500/20 border border-primary-500/30 shadow-inner"
          : "hover:bg-surface border border-transparent"
      }`}
    >
      <Avatar src={getAvatarUrl(otherUser)} alt={otherUser?.name || "User"} className="w-14 h-14" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-medium text-foreground truncate">{otherUser?.name || "Unknown"}</h3>
          <span className="text-xs text-muted flex-shrink-0 ml-2">
            {chat.lastMessage ? formatMessageTime(chat.lastMessage.createdAt) : ""}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className={`text-sm truncate ${unreadCount > 0 ? "text-primary-900 font-medium" : "text-muted"}`}>
            {chat.lastMessage ? chat.lastMessage.content : "Started a new conversation"}
          </p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary-500 text-primary-950 text-[10px] font-bold rounded-full shadow-lg shadow-primary-500/40">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
