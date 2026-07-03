const fs = require('fs');
let code = fs.readFileSync('app/(pages)/chat/page.tsx', 'utf8');

// Add Import
code = code.replace(
  'import { useRouter } from "next/navigation";',
  'import { useRouter } from "next/navigation";\nimport SearchModal from "../../components/SearchModal";'
);

// Add state and handleStartChat
code = code.replace(
  'const [messages, setMessages] = useState<any[]>([]);\n  const router = useRouter();',
  `const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleStartChat = (user) => {
    const newChat = {
      id: Date.now(),
      name: user.name,
      handle: user.handle,
      avatar: user.avatar,
      lastMessage: "Started a new conversation",
      time: "Just now",
      unread: 0
    };
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat.id);
    setMessages([]);
  };`
);

// Wrap sidebar
code = code.replace(
  '{/* Sidebar */}\n        <div className="w-full max-w-md flex flex-col h-full rounded-3xl backdrop-blur-xl bg-surface border border-border shadow-2xl overflow-hidden">',
  '{/* Sidebar */}\n        {chats.length > 0 && (\n        <div className="w-full max-w-md flex flex-col h-full rounded-3xl backdrop-blur-xl bg-surface border border-border shadow-2xl overflow-hidden">'
);

// Close sidebar wrapper before Main Chat Area
code = code.replace(
  '</div>\n\n        {/* Main Chat Area */}',
  '</div>\n        )}\n\n        {/* Main Chat Area */}'
);

// Update search bar to be a button essentially
code = code.replace(
  'className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"',
  'readOnly onClick={() => setIsSearchModalOpen(true)} className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted cursor-pointer focus:outline-none transition-all hover:bg-surface-hover"'
);

// Update Empty State
const oldEmptyState = `{selectedChat === null ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">`;

const newEmptyState = `{selectedChat === null ? (
            // Empty State
            <div className="flex-1 flex flex-col h-full relative">
              {chats.length === 0 && (
                <div className="p-5 border-b border-border flex items-center justify-between bg-surface absolute top-0 w-full rounded-t-3xl z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-500/50">
                      <Image src={currentUser?.avatar || \`https://i.pravatar.cc/150?u=\${currentUser?.email}\`} alt="My Avatar" fill className="object-cover" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{currentUser?.name}</h2>
                      <p className="text-xs text-primary-200/60">{currentUser?.handle}</p>
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
              )}
              
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-16">`;

code = code.replace(oldEmptyState, newEmptyState);

// Connect "Start Chatting" button
code = code.replace(
  '<button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-primary-950 font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 overflow-hidden">',
  '<button onClick={() => setIsSearchModalOpen(true)} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-primary-950 font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 overflow-hidden">'
);

// Close the inner div for the empty state
code = code.replace(
  '</button>\n            </div>\n          ) : (',
  '</button>\n              </div>\n            </div>\n          ) : ('
);

// Add the modal at the bottom
code = code.replace(
  '<style jsx global>{`',
  `<SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
        onSelectUser={handleStartChat} 
      />\n\n      <style jsx global>{\``
);

fs.writeFileSync('app/(pages)/chat/page.tsx', code);
console.log('Update complete.');
