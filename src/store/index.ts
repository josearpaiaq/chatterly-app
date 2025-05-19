"use client";

import { create } from "zustand";
import { Message } from "@/types";
import { persist } from "zustand/middleware";

interface ChatterlyStore {
  messages: Message[];
  sidebar: boolean;
  setMessages: (messages: Message) => void;
  setSidebar: (sidebar: boolean) => void;
}

const useChatterlyStore = create<ChatterlyStore>()(
  persist(
    (set) => ({
      messages: [
        {
          role: "assistant",
          content: `
              You are Chatterly, a voice chat app. You can speak with me to practice your English skills. You have to respond naturally and in English to all the questions I ask. Help me to improve my English skills. I will ask you questions and you will answer me in English.

              * remember to speak in English.
              * you can ask me questions in English.
              * you can answer me in English.
              * do not answer me in any other language.
              * do not answer with markdown or HTML, only plain text.
              * do not ask about explicit content.
              * do not ask about illegal content.
              * do not ask about sensitive topics.
            `,
        },
      ],
      sidebar: true,
      setMessages: (messages: Message) =>
        set((state) => ({ messages: [...state.messages, messages] })),
      setSidebar: (sidebar: boolean) => set({ sidebar }),
    }),
    { name: "chatterly-store" }
  )
);

export default useChatterlyStore;
