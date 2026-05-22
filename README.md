```

chat-ease/
├── app/                        # Next.js App Router
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── (pages)/                # Route group for pages
│   │   ├── (auth)/             # Route group for authentication
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── components/         # Reusable UI components
│   │   └── lib/                # Utilities and helpers
│   │       └── api.ts          # API calls
│   ├── api/                    # Serverless API endpoints
│   └── models/                 # Database models/schemas
│
├── public/                     # Static assets
├── src/                        # Source files
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Project dependencies
├── AGENTS.md                   # Agent configurations
├── CLAUDE.md                   # Claude agent settings
└── README.md                   # Project documentation

```
\