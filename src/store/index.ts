"use client";

import { create } from "zustand";
import { Message } from "@/types";
import { persist } from "zustand/middleware";

interface ChatterlyStore {
  messages: Message[];
  sidebar: boolean;
  setMessages: (message: Message) => void;
  setSidebar: (sidebar: boolean) => void;
  deleteMessage: (id: string) => void;
}

const useChatterlyStore = create<ChatterlyStore>()(
  persist(
    (set) => ({
      messages: [
        {
          id: "system-prompt",
          role: "system",
          content: `You are Chatterly, a voice-based English conversation practice app.

Rules:
- Keep every response under 2 sentences. This is a voice app — brevity is critical.
- English only. Plain text only — no markdown, no lists, no symbols.
- End each response with one short follow-up question to keep the conversation going.
- Gently correct grammar mistakes when relevant, in a natural way.
- Never discuss explicit, illegal, or sensitive topics.`,
        },
      ],
      sidebar: true,
      setMessages: (message: Message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setSidebar: (sidebar: boolean) => set({ sidebar }),
      deleteMessage: (id: string) =>
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== id),
        })),
    }),
    {
      name: "chatterly-store",
      version: 2,
      migrate: (persistedState: unknown, version) => {
        const state = persistedState as ChatterlyStore;
        if (version < 1) {
          state.messages = state.messages.map((msg) => ({
            ...msg,
            id: msg.id ?? crypto.randomUUID(),
          }));
        }
        if (version < 2) {
          // Reset system prompt to new content + correct role
          state.messages = state.messages.filter(
            (msg) => msg.id !== "system-prompt"
          );
          state.messages.unshift({
            id: "system-prompt",
            role: "system",
            content: `You are Chatterly, a voice-based English conversation practice app.

Rules:
- Keep every response under 2 sentences. This is a voice app — brevity is critical.
- English only. Plain text only — no markdown, no lists, no symbols.
- End each response with one short follow-up question to keep the conversation going.
- Gently correct grammar mistakes when relevant, in a natural way.
- Never discuss explicit, illegal, or sensitive topics.`,
          });
        }
        return state;
      },
    }
  )
);

export default useChatterlyStore;
