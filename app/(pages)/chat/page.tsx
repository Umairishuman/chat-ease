"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Send, Settings, LogOut, MoreVertical, Paperclip, Check, CheckCheck, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Mock Data
const MOCK_USER = {
  name: "Jane Doe",
  handle: "@janedoe",
  avatar: "https://i.pravatar.cc/150?u=jane",
};

const MOCK_CHATS = [
  { id: 1, name: "Alice Smith", handle: "@alice", avatar: "https://i.pravatar.cc/150?u=alice", lastMessage: "That sounds great! See you then.", time: "10:30 AM", unread: 2 },
  { id: 2, name: "Bob Johnson", handle: "@bobj", avatar: "https://i.pravatar.cc/150?u=bob", lastMessage: "Can you send me the files?", time: "Yesterday", unread: 0 },
  { id: 3, name: "Charlie Brown", handle: "@charlie", avatar: "https://i.pravatar.cc/150?u=charlie", lastMessage: "Haha exactly 😂", time: "Mon", unread: 0 },
];

const MOCK_MESSAGES = [
  { id: 1, senderId: 1, text: "Hey! Are we still on for tomorrow?", time: "10:15 AM" },
  { id: 2, senderId: 'me', text: "Yes absolutely! Let's meet at the coffee shop.", time: "10:20 AM", status: "read" },
  { id: 3, senderId: 1, text: "Perfect. I'll bring the documents we discussed.", time: "10:25 AM" },
  { id: 4, senderId: 1, text: "That sounds great! See you then.", time: "10:30 AM" },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("An error occurred during logout");
    }
  };

  const activeChatDetails = MOCK_CHATS.find((c) => c.id === selectedChat);

  return (
    <div className="relative h-screen flex bg-teal-950 text-teal-50 font-sans overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Global Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />
      <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />

      {/* Main Layout Container */}
      <div className="relative z-10 flex w-full h-full p-4 gap-4 backdrop-blur-3xl">
        
        {/* Sidebar */}
        <div className="w-full max-w-md flex flex-col h-full rounded-3xl backdrop-blur-xl bg-[#042f2e]/60 border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Sidebar Header (Current User) */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/50">
                <Image src={MOCK_USER.avatar} alt="My Avatar" fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-semibold text-white">{MOCK_USER.name}</h2>
                <p className="text-xs text-teal-200/60">{MOCK_USER.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-teal-100/60">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors hover:text-white" title="Settings">
                <Settings size={20} />
              </button>
              <button 
                onClick={handleLogout}
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-100/40" size={18} />
              <input
                type="text"
                placeholder="Search handles..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-teal-100/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
            {MOCK_CHATS.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${
                  selectedChat === chat.id
                    ? "bg-teal-500/20 border border-teal-500/30 shadow-inner"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
                  {/* Online indicator mock */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#061818] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-teal-50 truncate">{chat.name}</h3>
                    <span className="text-xs text-teal-100/50 flex-shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-sm truncate ${chat.unread > 0 ? "text-teal-100 font-medium" : "text-teal-100/50"}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-teal-500 text-[#042f2e] text-[10px] font-bold rounded-full shadow-lg shadow-teal-500/40">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full rounded-3xl backdrop-blur-xl bg-[#042f2e]/40 border border-white/10 shadow-2xl overflow-hidden relative">
          
          {selectedChat === null ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center mb-6 border border-teal-500/20 shadow-[0_0_50px_rgba(20,184,166,0.15)]">
                <Image src="/enhanced-chat-ease-logo.png" alt="Logo" width={0} height={0} sizes="100vw" className="w-auto h-12 opacity-80" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Your Messages</h2>
              <p className="text-teal-100/60 max-w-md font-light mb-8">
                Select a chat from the sidebar or search for a friend's handle to start a new conversation.
              </p>
              
              <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <MessageSquarePlus className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-lg tracking-wide">Start Chatting</span>
              </button>
            </div>
          ) : (
            // Active Chat
            <>
              {/* Chat Header */}
              <div className="p-4 px-6 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={activeChatDetails?.avatar || ""} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-white leading-tight">{activeChatDetails?.name}</h2>
                    <p className="text-xs text-teal-200/60">{activeChatDetails?.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-teal-100/60">
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors hover:text-white">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {MOCK_MESSAGES.map((msg, index) => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-5 py-3 rounded-2xl shadow-lg relative group ${
                            isMe
                              ? "bg-gradient-to-br from-teal-500 to-teal-600 text-teal-950 rounded-br-sm"
                              : "bg-white/10 text-teal-50 border border-white/5 backdrop-blur-md rounded-bl-sm"
                          }`}
                        >
                          <p className={`text-[15px] leading-relaxed ${isMe ? "font-medium" : "font-light"}`}>
                            {msg.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-1 mt-0.5">
                          <span className="text-[11px] text-teal-100/40 font-medium tracking-wide uppercase">
                            {msg.time}
                          </span>
                          {isMe && (
                            <span className="text-teal-500/80">
                              {msg.status === "read" ? <CheckCheck size={14} /> : <Check size={14} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Container */}
              <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-lg">
                <div className="flex items-end gap-3 bg-[#021817]/50 border border-white/10 rounded-[2rem] p-2 pr-2.5 shadow-inner">
                  <button className="p-3 text-teal-100/40 hover:text-teal-400 hover:bg-white/5 rounded-full transition-colors flex-shrink-0">
                    <Paperclip size={20} />
                  </button>
                  <textarea
                    rows={1}
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-teal-100/30 resize-none outline-none py-3 max-h-32 min-h-[48px] custom-scrollbar text-[15px]"
                  />
                  <button 
                    disabled={!messageInput.trim()}
                    className="p-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-teal-950 rounded-full transition-all shadow-lg shadow-teal-500/20 active:scale-95 flex-shrink-0 mb-0.5"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Custom Scrollbar for Chat Areas */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.4);
        }
      `}</style>
    </div>
  );
}
