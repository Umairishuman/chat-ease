"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Send, Settings, LogOut, MoreVertical, Smile, Check, CheckCheck, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SearchModal from "../../components/SearchModal";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedChatRef = useRef<string | null>(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };

  useEffect(() => {
    const fetchUserAndChats = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setCurrentUser(data.user);
        await fetchChats();
      } catch (err) {
        console.error("Failed to fetch user", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndChats();
  }, [router]);

  useEffect(() => {
    if (currentUser && !socketRef.current) {
      const socketInitializer = async () => {
        await fetch('/api/socket');
        
        socketRef.current = io(undefined, {
          path: '/api/socket',
        });

        socketRef.current.on('connect', () => {
          socketRef.current?.emit('register', currentUser._id);
        });

        socketRef.current.on('receive_message', (data: any) => {
          const { message, chatId } = data;
          
          if (selectedChatRef.current === chatId) {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
            markChatAsRead(chatId);
          }
          
          // Always refresh chats to update last message and unread counts
          fetchChats();
        });
      };
      
      socketInitializer();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      markChatAsRead(selectedChat);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  const markChatAsRead = async (chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat._id === chatId) {
          const newCounts = { ...chat.unreadCounts };
          if (currentUser?._id) {
            newCounts[currentUser._id] = 0;
          }
          return { ...chat, unreadCounts: newCounts };
        }
        return chat;
      })
    );

    try {
      await fetch(`/api/chats/${chatId}/read`, { method: "PUT" });
    } catch (err) {
      console.error("Failed to mark chat as read", err);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleStartChat = async (user: any) => {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchChats();
        setSelectedChat(data.chat._id);
      } else {
        toast.error(data.error || "Failed to start chat");
      }
    } catch (err) {
      toast.error("Error starting chat");
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || isSending) return;
    
    setIsSending(true);
    const tempMessage = {
      _id: Date.now().toString(),
      content: messageInput.trim(),
      senderId: currentUser?._id,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setMessageInput("");
    setShowEmojiPicker(false);
    scrollToBottom();

    try {
      const res = await fetch(`/api/chats/${selectedChat}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempMessage.content }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Replace temp message with real one from server
        setMessages(prev => prev.map(m => m._id === tempMessage._id ? data.message : m));
        fetchChats(); // Update last message in sidebar
        
        // Emit to socket
        if (socketRef.current && activeOtherParticipant) {
          socketRef.current.emit('send_message', {
            receiverId: activeOtherParticipant._id,
            message: data.message,
            chatId: selectedChat
          });
        }
      } else {
        toast.error("Failed to send message");
        // Remove temp message if failed
        setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      }
    } catch (err) {
      toast.error("Network error");
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput(prev => prev + emojiData.emoji);
  };

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

  const getOtherParticipant = (chat: any) => {
    return chat.participants.find((p: any) => p._id !== currentUser?._id) || chat.participants[0];
  };

  const activeChatDetails = chats.find((c) => c._id === selectedChat);
  const activeOtherParticipant = activeChatDetails ? getOtherParticipant(activeChatDetails) : null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background font-sans">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex bg-background text-foreground font-sans overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Main Layout Container */}
      <div className="relative z-10 flex w-full h-full p-4 gap-4 backdrop-blur-3xl">
        
        {/* Sidebar */}
        <div className="w-full max-w-md flex flex-col h-full rounded-3xl backdrop-blur-xl bg-surface border border-border shadow-2xl overflow-hidden">
          
          {/* Sidebar Header (Current User) */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-500/50">
                <Image src={currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUser?.email}`} alt="My Avatar" fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{currentUser?.name}</h2>
                <p className="text-xs text-primary-800/60">{currentUser?.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Link href="/settings" className="p-2 hover:bg-surface-hover rounded-full transition-colors hover:text-foreground inline-block" title="Settings">
                <Settings size={20} />
              </Link>
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search to start chatting..."
                readOnly onClick={() => setIsSearchModalOpen(true)} className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted cursor-pointer focus:outline-none transition-all hover:bg-surface-hover"
              />
            </div>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
            {chats.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-muted">
                 <p className="text-sm">No chats yet.</p>
                 <button onClick={() => setIsSearchModalOpen(true)} className="text-primary-500 hover:underline mt-2 text-sm font-medium">Find friends</button>
               </div>
            ) : chats.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              const unreadCount = chat.unreadCounts?.[currentUser?._id] || 0;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat._id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${
                    selectedChat === chat._id
                      ? "bg-primary-500/20 border border-primary-500/30 shadow-inner"
                      : "hover:bg-surface border border-transparent"
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={otherUser?.avatar || `https://i.pravatar.cc/150?u=${otherUser?.email}`} alt={otherUser?.name || 'User'} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-foreground truncate">{otherUser?.name || 'Unknown'}</h3>
                      <span className="text-xs text-muted flex-shrink-0 ml-2">
                        {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-sm truncate ${unreadCount > 0 ? "text-primary-900 font-medium" : "text-muted"}`}>
                        {chat.lastMessage ? chat.lastMessage.content : "Started a new conversation"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary-500 text-[#042f2e] text-[10px] font-bold rounded-full shadow-lg shadow-primary-500/40">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full rounded-3xl backdrop-blur-xl bg-surface border border-border shadow-2xl overflow-hidden relative">
          
          {selectedChat === null ? (
            // Empty State
            <div className="flex-1 flex flex-col h-full relative">
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-16">
              <div className="w-24 h-24 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20 shadow-[0_0_50px_rgba(20,184,166,0.15)]">
                <Image src="/enhanced-chat-ease-logo.png" alt="Logo" width={0} height={0} sizes="100vw" className="w-auto h-12 opacity-80" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Your Messages</h2>
              <p className="text-muted max-w-md font-light mb-8">
                Select a chat from the sidebar or search for a friend's handle to start a new conversation.
              </p>
              
              <button onClick={() => setIsSearchModalOpen(true)} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-primary-950 font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <MessageSquarePlus className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-lg tracking-wide">Start Chatting</span>
              </button>
              </div>
            </div>
          ) : (
            // Active Chat
            <>
              {/* Chat Header */}
              <div className="p-4 px-6 border-b border-border bg-surface flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                    <Image src={activeOtherParticipant?.avatar || `https://i.pravatar.cc/150?u=${activeOtherParticipant?.email}`} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground leading-tight">{activeOtherParticipant?.name}</h2>
                    <p className="text-xs text-primary-800/60">{activeOtherParticipant?.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <button className="p-2 hover:bg-surface-hover rounded-full transition-colors hover:text-foreground">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted">
                    <p>No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser?._id;
                    const msgTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-5 py-3 rounded-2xl shadow-lg relative group ${
                              isMe
                                ? "bg-chat-sender text-chat-sender-text rounded-br-sm"
                                : "bg-chat-receiver text-chat-receiver-text border border-border rounded-bl-sm"
                            }`}
                          >
                            <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${isMe ? "font-medium" : "font-light"}`}>
                              {msg.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 px-1 mt-0.5">
                            <span className="text-[11px] text-muted font-medium tracking-wide uppercase">
                              {msgTime}
                            </span>
                            {isMe && (
                              <span className="text-muted">
                                {msg.status === "read" ? <CheckCheck size={14} /> : <Check size={14} />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker Overlay */}
              {showEmojiPicker && (
                <div className="absolute bottom-24 left-4 z-50">
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick} 
                    theme={Theme.LIGHT} // Can match to theme later if desired
                  />
                </div>
              )}

              {/* Message Input Container */}
              <div className="p-4 bg-surface border-t border-border backdrop-blur-lg relative">
                <div className="flex items-end gap-3 bg-surface border border-border rounded-[2rem] p-2 pr-2.5 shadow-inner">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-3 rounded-full transition-colors flex-shrink-0 ${showEmojiPicker ? 'text-primary-600 bg-primary-500/10' : 'text-muted hover:text-primary-700 hover:bg-surface'}`}
                  >
                    <Smile size={20} />
                  </button>
                  <textarea
                    rows={1}
                    placeholder={`Message ${activeOtherParticipant?.handle || 'friend'}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-foreground placeholder-muted resize-none outline-none py-3 max-h-32 min-h-[48px] custom-scrollbar text-[15px]"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="p-3.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500 text-primary-950 rounded-full transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex-shrink-0 mb-0.5"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
        onSelectUser={handleStartChat} 
      />

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
