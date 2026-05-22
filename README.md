```

my-chat-app/
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── (auth)/             # Route group for authentication
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── api/                # Serverless API endpoints
│   │   │   ├── auth/[...nextauth]/route.ts  
│   │   │   ├── conversations/route.ts
│   │   │   └── messages/route.ts
│   │   ├── chat/               # Main chat interface
│   │   │   ├── [conversationId]/page.tsx # Dynamic route for the active chat
│   │   │   ├── layout.tsx      # Layout containing the sidebar
│   │   │   └── page.tsx        # Empty state ("Select a chat to start")
│   │   ├── layout.tsx          # Root layout (Providers, Fonts, Meta)
│   │   └── page.tsx            # Landing/Home page
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── chat/               # MessageBubble, ChatInput, Header
│   │   ├── sidebar/            # ConversationList, SearchBar
│   │   └── ui/                 # Generic buttons, inputs, modals, avatars
│   │
│   ├── lib/                    # Configuration and Utilities
│   │   ├── db.ts               # MongoDB mongoose connection setup
│   │   ├── pusher.ts           # Real-time connection config (or Socket.io)
│   │   └── utils.ts            # Helper functions (date formatting, etc.)
│   │
│   ├── models/                 # MongoDB Mongoose Schemas
│   │   ├── Conversation.ts
│   │   ├── Message.ts
│   │   └── User.ts
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useChatScroll.ts    # Auto-scrolls to new messages
│   │   └── useRoutes.ts        # Manages active sidebar states
│   │
│   └── providers/              # Context Providers
│       ├── ThemeProvider.tsx   # For dark mode
│       └── AuthContext.tsx     # Session wrapping
│
├── .env                        # Environment variables (Mongo URI, Secret keys)
├── tailwind.config.ts          
└── package.json

```