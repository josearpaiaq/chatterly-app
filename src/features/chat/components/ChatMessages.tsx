"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Loader2, Send } from "lucide-react";
import useChatterlyStore from "@/features/chat/store";
import Message from "./Message";
import VoiceRecorderButton from "@/features/voice/components/VoiceRecorderButton";
import { playMessage } from "@/features/voice/lib/synthesis";

const PAGE_SIZE = 20;

interface Props {
  compactMic?: boolean;
}

export default function ChatMessages({ compactMic = false }: Props) {
  const { chats, activeChatId, addMessage, deleteMessage, setIsAISpeaking } = useChatterlyStore();

  const allMessages = useMemo(
    () =>
      (chats.find((c) => c.id === activeChatId)?.messages ?? []).filter(
        (m) => m.role !== "system"
      ),
    [chats, activeChatId]
  );

  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<number | null>(null); // scrollHeight snapshot before loading more
  const didSwitchChatRef = useRef(false);

  const hasMore = allMessages.length > visibleCount;

  const visibleMessages = useMemo(
    () => allMessages.slice(-visibleCount),
    [allMessages, visibleCount]
  );

  // On chat switch: reset pagination and mark for instant scroll
  useEffect(() => {
    didSwitchChatRef.current = true;
    anchorRef.current = null;
    setVisibleCount(PAGE_SIZE);
  }, [activeChatId]);

  // After visible messages update, adjust scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (didSwitchChatRef.current) {
      // Instant scroll — no animation — so the jump is invisible
      el.scrollTop = el.scrollHeight;
      didSwitchChatRef.current = false;
      return;
    }

    if (anchorRef.current !== null) {
      // Restore position after prepending older messages
      el.scrollTop = el.scrollHeight - anchorRef.current;
      anchorRef.current = null;
      return;
    }

    // New message: smooth scroll only if the user is near the bottom
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasMore || anchorRef.current !== null) return;
    if (el.scrollTop < 100) {
      anchorRef.current = el.scrollHeight;
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: currentMessage,
      };
      addMessage(userMessage);
      setCurrentMessage("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...allMessages, userMessage] }),
      });

      if (!res.ok) throw new Error("Failed to get response from AI");

      const { result } = await res.json();
      addMessage({ id: crypto.randomUUID(), role: "assistant" as const, content: result });
      setIsLoading(false);
      setIsAISpeaking(true);
      playMessage(result, () => setIsAISpeaking(false));
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-1"
      >
        {visibleMessages.length === 0 ? (
          <p className="text-white/50 text-center text-base mt-12">
            {compactMic ? "Type or tap 🎤 to start" : "Start a conversation below"}
          </p>
        ) : (
          <>
            {hasMore && (
              <p className="text-white/30 text-xs text-center py-2 select-none">
                ↑ Scroll for earlier messages
              </p>
            )}
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } w-full`}
              >
                <Message
                  role={message.role as "user" | "assistant"}
                  message={message.content}
                  onDelete={() => deleteMessage(message.id)}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-sm px-4 pb-1">{error}</p>}

      <form
        className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border-t border-gray-800 shrink-0"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={isLoading}
        />

        {compactMic && <VoiceRecorderButton compact />}

        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg px-3 py-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="text-white animate-spin" size={20} />
          ) : (
            <Send className="text-white" size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
