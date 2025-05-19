"use client";

import VoiceRecorderButton from "@/components/VoiceRecorderButton";
import useChatterlyStore from "@/store";
import { useEffect, useRef } from "react";

export const dynamic = "force-dynamic";

export default function Chat() {
  const { sidebar, messages } = useChatterlyStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      // container.scrollTop = container.scrollHeight;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col sm:flex-row h-full w-screen bg-gray-600 transition-all duration-300">
      <div
        className={`bg-gray-900 p-4 transition-all duration-500 ease-in-out overflow-auto h-full ${
          sidebar
            ? "absolute sm:static z-50 w-full sm:w-4/12 md:w-6/12 opacity-100"
            : "hidden sm:block sm:w-0 sm:opacity-0 sm:pointer-events-none sm:overflow-hidden"
        }`}
        style={{ transitionProperty: "width, opacity" }}
        ref={scrollRef}
      >
        <h1 className="text-4xl font-bold mb-3">Chatterly Chat</h1>
        {messages
          .filter((_, i) => i !== 0)
          .map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } w-full`}
            >
              <div
                className={`flex flex-col justify-center p-4 rounded-lg my-2 max-w-[75%] ${
                  message.role === "user" ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                <p className="text-white">{message.content || "..."}</p>
              </div>
            </div>
          ))}

        {messages.filter((_, i) => i !== 0).length === 0 && (
          <>
            <p className="text-white text-2xl mt-12 hidden sm:block">
              Start a conversation by clicking the 🎤 on the right.
            </p>

            <p className="text-white text-2xl mt-12 sm:hidden">
              Start a conversation by clicking the 🎤 after closing this chat.
            </p>
          </>
        )}
      </div>
      <div
        className={`flex items-center justify-center h-full transition-all duration-500 ease-in-out w-full`}
      >
        <VoiceRecorderButton />
      </div>
    </div>
  );
}
