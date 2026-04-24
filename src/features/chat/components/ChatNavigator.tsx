"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pencil, VolumeX } from "lucide-react";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import VoiceRecorderButton from "@/features/voice/components/VoiceRecorderButton";
import { cancelPlayMessage } from "@/features/voice/lib/synthesis";
import useChatterlyStore from "@/features/chat/store";

interface Props {
  showMicInList?: boolean;
  compactMicInChat?: boolean;
}

export default function ChatNavigator({
  showMicInList = false,
  compactMicInChat = false,
}: Props) {
  const [view, setView] = useState<"list" | "chat">("list");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { chats, activeChatId, isAISpeaking, setIsAISpeaking, renameChat } =
    useChatterlyStore();
  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (editingTitle !== null) inputRef.current?.focus();
  }, [editingTitle]);

  const handleStopAI = () => {
    cancelPlayMessage();
    setIsAISpeaking(false);
  };

  const commitTitle = () => {
    const trimmed = editingTitle?.trim();
    if (trimmed && activeChatId) renameChat(activeChatId, trimmed);
    setEditingTitle(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sliding container — Panel 1 and Panel 2 side by side */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{
          width: "200%",
          transform: view === "chat" ? "translateX(-50%)" : "translateX(0)",
        }}
      >
        {/* Panel 1: Chat List */}
        <div className="flex flex-col overflow-hidden" style={{ width: "50%" }}>
          <div className="flex-1 overflow-y-auto p-4">
            <ChatList onChatSelect={() => setView("chat")} />
          </div>
          {showMicInList && (
            <div className="flex items-center justify-center py-4 shrink-0">
              <VoiceRecorderButton />
            </div>
          )}
        </div>

        {/* Panel 2: Chat Messages */}
        <div className="flex flex-col overflow-hidden" style={{ width: "50%" }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 shrink-0 bg-gray-900">
            {/* Back */}
            <button
              onClick={() => setView("list")}
              className="text-gray-400 hover:text-white transition-colors p-1 -ml-1 shrink-0"
              aria-label="Back to chats"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Editable title */}
            {editingTitle !== null ? (
              <input
                ref={inputRef}
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitTitle();
                  if (e.key === "Escape") setEditingTitle(null);
                }}
                className="flex-1 bg-transparent text-white text-sm font-medium outline-none border-b border-gray-500 min-w-0"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(activeChat?.title ?? "")}
                className="flex-1 flex items-center gap-1.5 min-w-0 group text-left"
              >
                <span className="text-white font-medium truncate text-sm">
                  {activeChat?.title ?? "Chat"}
                </span>
                <Pencil
                  size={12}
                  className="text-gray-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            )}

            {/* Stop AI — only visible while speaking */}
            {isAISpeaking && (
              <button
                onClick={handleStopAI}
                className="text-orange-400 hover:text-orange-300 transition-colors p-1 shrink-0"
                aria-label="Stop AI"
              >
                <VolumeX size={18} />
              </button>
            )}
          </div>

          <ChatMessages compactMic={compactMicInChat} />
        </div>
      </div>
    </div>
  );
}
