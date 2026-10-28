# Chat-Ease

Chat-Ease is a real-time, one-to-one messaging web app built with **Next.js 16 (App Router)**, **React 19**, **MongoDB/Mongoose** and **Socket.io**, styled with **Tailwind CSS v4**.

## Features

- Email/password sign-up and login (bcrypt-hashed passwords, JWT session in an httpOnly cookie, "remember me")
- Google Sign-In
- Password reset with a 6-digit code sent by email (Gmail via Nodemailer)
- User search by name, handle or email, and starting a new conversation
- Real-time messaging over Socket.io, with messages stored in MongoDB
- Unread counters and read tracking per chat
- Emoji picker
- Profile settings with avatar uploads to Cloudinary
- Themeable UI driven by CSS variables in `app/globals.css`

## Tech stack

| Layer     | Tech                                                          |
| --------- | ------------------------------------------------------------- |
| Frontend  | Next.js 16 App Router, React 19, Tailwind CSS 4, lucide-react |
| Backend   | Next.js Route Handlers (`app/api/**`), Socket.io (`pages/api/socket.ts`) |
| Database  | MongoDB with Mongoose                                         |
| Auth      | `jose` (JWT), `bcryptjs`, Google Identity (`@react-oauth/google`, `google-auth-library`) |
| Services  | Cloudinary (avatars), Gmail SMTP (reset emails)               |

## Project structure

```
app/
├── (pages)/
│   ├── (auth)/            # login, register, forgot-password pages
│   ├── chat/              # main chat UI
│   ├── settings/          # profile settings
│   └── lib/db.ts          # cached MongoDB connection
├── api/
│   ├── auth/              # register, login, logout, me, google, forgot/reset password
│   ├── chats/             # list/create chats, messages, mark as read
│   ├── user/              # search, profile update
│   ├── health/            # health check (reports MongoDB connectivity)
│   └── lib/               # session/JWT helpers
├── components/            # Navbar, SearchModal, Providers
├── models/                # User, Chat, Message schemas
├── globals.css            # theme variables
└── layout.tsx
pages/api/socket.ts        # Socket.io server (needs a long-running Node server)
api/auth.ts                # client-side auth fetch wrappers
public/                    # static assets
```

## Local development

Requires Node.js 20.9 or later and a MongoDB database (local or Atlas).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Environment variables

See [`.env.example`](./.env.example) for the full list with comments.

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JOSE_SECRET` | Yes in production | Signs session tokens. The server refuses to issue or verify sessions in production without it. Generate with `openssl rand -base64 48` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | For Google Sign-In | Inlined at **build** time |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | For avatar uploads | Inlined at **build** time |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | For avatar uploads | Unsigned upload preset, inlined at **build** time |
| `EMAIL_USER` / `EMAIL_PASS` | For password reset | Gmail address and a Gmail App Password |

## Deployment

> **Important:** real-time messaging uses a Socket.io server that attaches to the Node.js HTTP server (`pages/api/socket.ts`). It needs a **long-running Node.js server** (`next start`). Serverless platforms such as **Vercel and Netlify do not support this**: the app would build, but live message delivery would not work (messages would only appear after a refresh).
>
> Run a **single instance**. Socket.io rooms live in memory, so with several instances, users connected to different instances won't get each other's live messages. To scale out, add the [Socket.io Redis adapter](https://socket.io/docs/v4/redis-adapter/).

### Option A: Node.js host (Render, Railway, a VPS, …)

- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start` (listens on `$PORT`, default 3000)
- **Health check path:** `/api/health`
- Set all environment variables from the table above **before the first build**, because the `NEXT_PUBLIC_*` values are baked into the client bundle.

### Option B: Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=... \
  --build-arg NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=... \
  --build-arg NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=... \
  -t chat-ease .
```

```bash
docker run -p 3000:3000 \
  -e MONGODB_URI=... -e JOSE_SECRET=... \
  -e EMAIL_USER=... -e EMAIL_PASS=... \
  chat-ease
```

Works on Fly.io, Google Cloud Run (configure session affinity and a long request timeout for WebSockets), AWS ECS, DigitalOcean App Platform and similar.

### Post-deploy checklist

1. **MongoDB Atlas → Network Access:** allow your host's outbound IPs (or `0.0.0.0/0`).
2. **Google Cloud Console → OAuth client:** add your production URL (e.g. `https://chat-ease.example.com`) to *Authorized JavaScript origins*.
3. **Cloudinary:** the upload preset must be **unsigned**.
4. **Gmail:** use an App Password for `EMAIL_PASS`.
5. Serve the app over **HTTPS**. Session cookies are marked `Secure` in production.
6. Open `/api/health`: it should return `{"status":"ok","database":"connected"}`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
