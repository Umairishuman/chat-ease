"use client";

import React, { useState, useEffect } from "react";
import { Search, X, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import { searchUsers } from "@/app/(pages)/lib/api";
import { getErrorMessage } from "@/app/(pages)/lib/errors";
import type { SearchUser } from "@/app/types/chat";

// Debounce delay before querying the search API
const SEARCH_DEBOUNCE_MS = 400;

interface SearchModalProps {
  onClose: () => void;
  onSelectUser: (user: SearchUser) => void;
}

// Render only while open; unmounting resets the query and results.
export default function SearchModal({ onClose, onSelectUser }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        setSearchResults(await searchUsers(searchQuery));
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to search users"));
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
            placeholder="Search by handle or email..."
            className="flex-1 bg-transparent text-foreground placeholder-muted outline-none text-lg"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-surface rounded-full transition-colors text-muted hover:text-foreground">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="p-2 ml-1 hover:bg-surface rounded-full transition-colors text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() && (
            <div className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
              Search Results
              {isSearching && <Loader2 size={12} className="animate-spin" />}
            </div>
          )}

          <div className="mt-1 space-y-1">
            {!searchQuery.trim() ? (
              <div className="p-8 text-center text-muted">
                Type a username, handle, or email to start searching.
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} alt={user.name} className="w-12 h-12 border border-border" />
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
            ) : isSearching ? (
              <div className="p-8 text-center text-muted flex justify-center items-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Searching...
              </div>
            ) : (
              <div className="p-8 text-center text-muted">
                No users found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
