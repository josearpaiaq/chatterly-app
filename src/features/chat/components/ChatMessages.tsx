"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import useChatterlyStore from "@/features/chat/store";
import Message from "./Message";
import VoiceRecorderButton from "@/features/voice/components/VoiceRecorderButton";
import { playMessage } from "@/features/voice/lib/synthesis";

interface Props {
  compactMic?: boolean;
}

export default function ChatMessages({ compactMic = false }: Props) {
  const { chats, activeChatId, addMessage, deleteMessage, setIsAISpeaking } = useChatterlyStore();
  const messages = chats.find((c) => c.id === activeChatId)?.messages ?? [];
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      const newMessages = [...messages, userMessage];
      addMessage(userMessage);
      setCurrentMessage("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        {visibleMessages.length === 0 ? (
          <p className="text-white/50 text-center text-base mt-12">
            {compactMic ? "Type or tap 🎤 to start" : "Start a conversation below"}
          </p>
        ) : (
          visibleMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
            >
              <Message
                role={message.role as "user" | "assistant"}
                message={message.content}
                onDelete={() => deleteMessage(message.id)}
              />
            </div>
          ))
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
