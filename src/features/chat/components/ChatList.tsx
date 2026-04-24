"use client";

import { Plus, MessageSquare } from "lucide-react";
import useChatterlyStore from "@/features/chat/store";

interface Props {
  onChatSelect?: () => void;
}

export default function ChatList({ onChatSelect }: Props) {
  const { chats, activeChatId, setActiveChat, createChat } = useChatterlyStore();

  const handleSelect = (id: string) => {
    setActiveChat(id);
    onChatSelect?.();
  };

  const handleNew = () => {
    createChat();
    onChatSelect?.();
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-semibold text-sm">Your Chats</span>
        <button
          onClick={handleNew}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium"
        >
          <Plus size={14} />
          New chat
        </button>
      </div>

      <div className="flex flex-col gap-0.5">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => handleSelect(chat.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              chat.id === activeChatId
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <MessageSquare size={13} className="shrink-0 opacity-70" />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
