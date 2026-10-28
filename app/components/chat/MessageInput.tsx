"use client";

import { useState } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface MessageInputProps {
  placeholder: string;
  onSend: (content: string) => Promise<void>;
}

export default function MessageInput({ placeholder, onSend }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const send = async () => {
    const content = value.trim();
    if (!content || isSending) return;

    setIsSending(true);
    setValue("");
    setShowEmojiPicker(false);
    try {
      await onSend(content);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setValue((prev) => prev + emojiData.emoji);
  };

  return (
    <>
      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-24 left-4 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.LIGHT} />
        </div>
      )}

      {/* Message Input Container */}
      <div className="p-4 bg-surface border-t border-border backdrop-blur-lg relative">
        <div className="flex items-end gap-3 bg-surface border border-border rounded-[2rem] p-2 pr-2.5 shadow-inner">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-full transition-colors flex-shrink-0 ${showEmojiPicker ? "text-primary-600 bg-primary-500/10" : "text-muted hover:text-primary-700 hover:bg-surface"}`}
          >
            <Smile size={20} />
          </button>
          <textarea
            rows={1}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground placeholder-muted resize-none outline-none py-3 max-h-32 min-h-[48px] custom-scrollbar text-[15px]"
          />
          <button
            onClick={send}
            disabled={!value.trim() || isSending}
            className="p-3.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500 text-primary-950 rounded-full transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex-shrink-0 mb-0.5"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </>
  );
}
