import Link from "next/link";
import { Search, Settings, LogOut } from "lucide-react";
import Avatar from "../Avatar";
import ChatListItem from "./ChatListItem";
import { getAvatarUrl } from "@/app/(pages)/lib/chat";
import type { Chat, ChatUser } from "@/app/types/chat";

interface ChatSidebarProps {
  currentUser: ChatUser;
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenSearch: () => void;
  onLogout: () => void;
}

export default function ChatSidebar({
  currentUser,
  chats,
  selectedChatId,
  onSelectChat,
  onOpenSearch,
  onLogout,
}: ChatSidebarProps) {
  return (
    <div className="w-full max-w-md flex flex-col h-full rounded-3xl backdrop-blur-xl bg-surface border border-border shadow-2xl overflow-hidden">
      {/* Sidebar Header (Current User) */}
      <div className="p-5 border-b border-border flex items-center justify-between bg-surface">
        <div className="flex items-center gap-3">
          <Avatar src={getAvatarUrl(currentUser)} alt="My Avatar" className="w-12 h-12 border-2 border-primary-500/50" />
          <div>
            <h2 className="font-semibold text-foreground">{currentUser.name}</h2>
            <p className="text-xs text-primary-800/60">{currentUser.handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Link href="/settings" className="p-2 hover:bg-surface-hover rounded-full transition-colors hover:text-foreground inline-block" title="Settings">
            <Settings size={20} />
          </Link>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-500/20 text-red-400/80 hover:text-red-400 rounded-full transition-colors"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search to start chatting..."
            readOnly
            onClick={onOpenSearch}
            className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted cursor-pointer focus:outline-none transition-all hover:bg-surface-hover"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted">
            <p className="text-sm">No chats yet.</p>
            <button onClick={onOpenSearch} className="text-primary-500 hover:underline mt-2 text-sm font-medium">Find friends</button>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              currentUserId={currentUser._id}
              isSelected={selectedChatId === chat._id}
              onSelect={onSelectChat}
            />
          ))
        )}
      </div>
    </div>
  );
}
