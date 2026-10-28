import { MoreVertical } from "lucide-react";
import Avatar from "../Avatar";
import { getAvatarUrl } from "@/app/(pages)/lib/chat";
import type { ChatUser } from "@/app/types/chat";

interface ChatHeaderProps {
  user: ChatUser;
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="p-4 px-6 border-b border-border bg-surface flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Avatar src={getAvatarUrl(user)} alt="Avatar" className="w-12 h-12 border border-border" />
        <div>
          <h2 className="font-semibold text-lg text-foreground leading-tight">{user.name}</h2>
          <p className="text-xs text-primary-800/60">{user.handle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-muted">
        <button className="p-2 hover:bg-surface-hover rounded-full transition-colors hover:text-foreground">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
