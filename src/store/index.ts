"use client";

import { create } from "zustand";
import { Message } from "@/types";

interface ChatterlyStore {
  messages: Message[];
  sidebar: boolean;
  setMessages: (messages: Message) => void;
  setSidebar: (sidebar: boolean) => void;
}

const useChatterlyStore = create<ChatterlyStore>((set) => ({
  messages: [
    {
      role: "assistant",
      content:
        "You are Chatterly, a voice chat app. You can speak with me to practice your English skills. You have to respond naturally and in English to all the questions I ask. Help me to improve my English skills. I will ask you questions and you will answer me in English.",
    },
  ],
  sidebar: true,
  setMessages: (messages: Message) =>
    set((state) => ({ messages: [...state.messages, messages] })),
  setSidebar: (sidebar: boolean) => set({ sidebar }),
}));

export default useChatterlyStore;
