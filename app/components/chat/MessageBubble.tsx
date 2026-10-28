import { Check, CheckCheck } from "lucide-react";
import { formatMessageTime } from "@/app/(pages)/lib/chat";
import type { ChatMessage } from "@/app/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export default function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col gap-1 max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>
        <div
          className={`px-5 py-3 rounded-2xl shadow-lg relative group ${
            isMine
              ? "bg-chat-sender text-chat-sender-text rounded-br-sm"
              : "bg-chat-receiver text-chat-receiver-text border border-border rounded-bl-sm"
          }`}
        >
          <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${isMine ? "font-medium" : "font-light"}`}>
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-1 mt-0.5">
          <span className="text-[11px] text-muted font-medium tracking-wide uppercase">
            {formatMessageTime(message.createdAt)}
          </span>
          {isMine && (
            <span className="text-muted">
              {message.status === "read" ? <CheckCheck size={14} /> : <Check size={14} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
