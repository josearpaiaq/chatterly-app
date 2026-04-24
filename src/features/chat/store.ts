"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppSettings, Chat, Message } from "@/features/chat/types";

const SYSTEM_PROMPT = `You are Chatterly, a voice-based English conversation practice app.

Rules:
- Keep every response under 2 sentences. This is a voice app — brevity is critical.
- English only. Plain text only — no markdown, no lists, no symbols.
- End each response with one short follow-up question to keep the conversation going.
- Gently correct grammar mistakes when relevant, in a natural way.
- Never discuss explicit, illegal, or sensitive topics.`;

const SYSTEM_MESSAGE: Message = {
  id: "system-prompt",
  role: "system",
  content: SYSTEM_PROMPT,
};

const DEFAULT_SETTINGS: AppSettings = {
  voice: "en-US-AriaNeural",
  speechRate: 1.0,
  autoReplay: false,
  theme: "dark",
  micButtonSize: "normal",
  targetLanguage: "en",
  correctionLevel: "subtle",
};

function makeChat(overrides?: Partial<Chat>): Chat {
  return {
    id: crypto.randomUUID(),
    userId: "anonymous",
    title: "New Chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [{ ...SYSTEM_MESSAGE }],
    ...overrides,
  };
}

interface ChatterlyStore {
  chats: Chat[];
  activeChatId: string | null;
  settings: AppSettings;
  sidebar: boolean;
  isAISpeaking: boolean;

  createChat: () => void;
  setActiveChat: (id: string) => void;
  addMessage: (message: Message) => void;
  deleteMessage: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setSidebar: (sidebar: boolean) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  setIsAISpeaking: (v: boolean) => void;
}

const initialChat = makeChat();

const useChatterlyStore = create<ChatterlyStore>()(
  persist(
    (set) => ({
      chats: [initialChat],
      activeChatId: initialChat.id,
      settings: DEFAULT_SETTINGS,
      sidebar: true,
      isAISpeaking: false,

      createChat: () =>
        set((state) => {
          const chat = makeChat();
          return { chats: [...state.chats, chat], activeChatId: chat.id };
        }),

      setActiveChat: (id) => set({ activeChatId: id }),

      addMessage: (message) =>
        set((state) => {
          const idx = state.chats.findIndex((c) => c.id === state.activeChatId);
          if (idx === -1) return state;

          const chat = state.chats[idx];
          const isFirstUserMsg =
            message.role === "user" &&
            chat.messages.filter((m) => m.role === "user").length === 0;

          const updated: Chat = {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: Date.now(),
            title: isFirstUserMsg ? message.content.slice(0, 50) : chat.title,
          };

          const chats = [...state.chats];
          chats[idx] = updated;
          return { chats };
        }),

      deleteMessage: (id) =>
        set((state) => {
          const idx = state.chats.findIndex((c) => c.id === state.activeChatId);
          if (idx === -1) return state;

          const chat = state.chats[idx];
          const updated: Chat = {
            ...chat,
            messages: chat.messages.filter((m) => m.id !== id),
            updatedAt: Date.now(),
          };

          const chats = [...state.chats];
          chats[idx] = updated;
          return { chats };
        }),

      renameChat: (id, title) =>
        set((state) => {
          const idx = state.chats.findIndex((c) => c.id === id);
          if (idx === -1) return state;
          const chats = [...state.chats];
          chats[idx] = { ...chats[idx], title, updatedAt: Date.now() };
          return { chats };
        }),

      setSidebar: (sidebar) => set({ sidebar }),

      setIsAISpeaking: (v) => set({ isAISpeaking: v }),

      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
    }),
    {
      name: "chatterly-store",
      version: 3,
      partialize: ({ isAISpeaking: _, setIsAISpeaking: __, ...rest }) => rest,
      migrate: (persisted: unknown, version) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let s = persisted as any;

        if (version < 1) {
          s.messages = s.messages.map((m: Message) => ({
            ...m,
            id: m.id ?? crypto.randomUUID(),
          }));
        }

        if (version < 2) {
          s.messages = s.messages.filter(
            (m: Message) => m.id !== "system-prompt"
          );
          s.messages.unshift({ ...SYSTEM_MESSAGE });
        }

        if (version < 3) {
          const oldMessages: Message[] = s.messages ?? [{ ...SYSTEM_MESSAGE }];
          const chat = makeChat({
            title:
              oldMessages.find((m) => m.role === "user")?.content.slice(0, 50) ??
              "New Chat",
            messages: oldMessages,
          });
          return {
            chats: [chat],
            activeChatId: chat.id,
            settings: DEFAULT_SETTINGS,
            sidebar: s.sidebar ?? true,
          };
        }

        return s;
      },
    }
  )
);

export default useChatterlyStore;
