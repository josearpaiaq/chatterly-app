# 📘 Chatterly App

## 🗣️ Chatterly — Practice English with AI Conversations

Chatterly is a voice-based web application designed to help users improve their spoken English by conversing with an AI in real-time. Using speech recognition and synthesis, it provides an interactive and immersive learning experience directly in the browser.

## 🚀 Live Preview

[Chatterly App online now](https://chatterly.lat)

## 🛠️ Tech Stack

- **Next.js 15** — React framework (App Router, Server Components, API Routes)
- **TypeScript** — Static typing throughout
- **TailwindCSS v4** — Utility-first CSS framework
- **Clerk** — Authentication (Email/password, Google, GitHub, Twitch, etc.)
- **Zustand** — Lightweight global state management
- **Groq API** (via OpenAI-compatible SDK) — AI chat completions (`llama-3.3-70b-versatile`) and audio transcription (`whisper-large-v3`)
- **Azure Cognitive Services Speech** — Text-to-Speech synthesis (`en-US-AriaNeural`)
- **Lucide React** — Icon library
- **Supabase (soon)** — Will store conversations, context, and user metadata

## 📦 Features

- 🎤 Voice input via browser-native SpeechRecognition + Groq Whisper transcription
- 🧠 AI-based conversation with initial context to simulate natural chat
- 🔊 Text-to-Speech replies powered by Azure Neural voices
- ✅ Authentication with Clerk (OAuth + email/password)
- 💾 State managed with Zustand
- 🔐 Protected API routes via Clerk middleware

## ✨ Features to Come

- 🌍 Multilingual support — Practice in other languages besides English
- 🎙️ Advanced voice options — Different tones, genders, and languages
- 🧠 Conversation context persistence — Save past chats with Supabase
- 🌘 Light/Dark mode
- 🔐 Protected pages for user-specific content using Clerk auth
- 📁 Organized conversation history
- 🎯 Conversation themes & levels (Beginner, Travel, Business…)

---

## 🧑‍💻 Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- npm or pnpm
- Accounts for: [Clerk](https://clerk.com), [Groq](https://console.groq.com), [Azure](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text)

### 1. Clone the repository

```bash
git clone https://github.com/josearpaiaq/chatterly-app.git
cd chatterly-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the sample env file and fill in your keys:

```bash
cp .env.sample .env.local
```

Then edit `.env.local`:

```env
# Clerk — get from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Groq — get from https://console.groq.com/keys
GROQ_API_KEY=gsk_...

# Azure Speech — get from https://portal.azure.com
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus   # e.g. eastus, westeurope
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The dev server uses **Turbopack** for fast refresh.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts   # Chat completions via Groq (llama-3.3-70b)
│   │   ├── transcribe/route.ts # Audio transcription via Groq Whisper
│   │   └── tts/route.ts        # Text-to-speech via Azure Neural voices
│   ├── layout.tsx              # Root layout with ClerkProvider
│   ├── page.tsx                # Entry point
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── BurgerMenu.tsx
│   ├── Message.tsx
│   ├── SideChat.tsx
│   └── VoiceRecorderButton.tsx
├── views/
│   ├── LandingPage.tsx
│   └── ChatPage.tsx
├── store/
│   └── index.ts                # Zustand global store
├── lib/
│   ├── openai.ts               # Groq client (OpenAI-compatible)
│   ├── synthesis.ts            # Azure TTS helper
│   └── constants.ts
├── types/
│   └── index.ts
└── middleware.ts               # Clerk route protection
```

---

## 🔌 API Routes

| Route | Method | Auth Required | Description |
|---|---|---|---|
| `/api/generate` | POST | ✅ Yes | Sends chat messages to Groq, returns AI reply. Keeps last 8 messages as context. |
| `/api/transcribe` | POST | ❌ No | Accepts audio file (FormData), returns transcribed text via Whisper. |
| `/api/tts` | POST | ❌ No | Accepts `{ text }`, returns MP3 audio stream from Azure Neural TTS. |

---

## 🚢 Deployment

The app is deployed on **Vercel**.

### Deploy your own

1. Push your fork to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.sample` in the Vercel project settings (Settings → Environment Variables).
4. Deploy — Vercel auto-detects Next.js and handles the build.

### Build locally

```bash
npm run build
npm run start
```

---

## 🧹 Other Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
