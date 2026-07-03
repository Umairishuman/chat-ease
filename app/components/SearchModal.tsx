"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, X, UserPlus } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: any) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectUser }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Hardcoded examples for now
  const suggestedUsers = [
    { id: "mock1", name: "Alice Smith", handle: "@alice_s", avatar: "https://i.pravatar.cc/150?u=alice@example.com" },
    { id: "mock2", name: "Bob Johnson", handle: "@bobj", avatar: "https://i.pravatar.cc/150?u=bob@example.com" },
    { id: "mock3", name: "Charlie Davis", handle: "@charlied", avatar: "https://i.pravatar.cc/150?u=charlie@example.com" },
  ];

  const filteredUsers = suggestedUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-background border border-border rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Search Input Area */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="text-muted flex-shrink-0" size={22} />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for handles, e.g. @alice..."
            className="flex-1 bg-transparent text-foreground placeholder-muted outline-none text-lg"
          />
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
            {searchQuery.trim() ? "Search Results" : "Suggested Users"}
          </div>
          
          <div className="mt-1 space-y-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                      <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight">{user.name}</h3>
                      <p className="text-sm text-muted">{user.handle}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted">
                No users found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
