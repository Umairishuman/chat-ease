import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";

interface EmptyChatStateProps {
  onStartChatting: () => void;
}

export default function EmptyChatState({ onStartChatting }: EmptyChatStateProps) {
  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-16">
        <div className="w-24 h-24 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20 shadow-[0_0_50px_rgba(20,184,166,0.15)]">
          <Image src="/enhanced-chat-ease-logo.png" alt="Logo" width={0} height={0} sizes="100vw" className="w-auto h-12 opacity-80" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Your Messages</h2>
        <p className="text-muted max-w-md font-light mb-8">
          Select a chat from the sidebar or search for a friend&apos;s handle to start a new conversation.
        </p>

        <button onClick={onStartChatting} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-primary-950 font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <MessageSquarePlus className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10 text-lg tracking-wide">Start Chatting</span>
        </button>
      </div>
    </div>
  );
}
