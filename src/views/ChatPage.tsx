"use client";

import VoiceRecorderButton from "@/components/VoiceRecorderButton";
import useChatterlyStore from "@/store";

export const dynamic = "force-dynamic";

export default function Chat() {
  const { sidebar, messages } = useChatterlyStore();

  return (
    <div className="flex flex-col sm:flex-row h-full w-screen bg-gray-600 transition-all duration-300">
      <div
        className={`bg-gray-900 p-4 transition-all duration-500 ease-in-out overflow-auto h-full ${
          sidebar
            ? "absolute sm:static z-50 w-full sm:w-4/12 opacity-100"
            : "hidden sm:block sm:w-0 sm:opacity-0 sm:pointer-events-none sm:overflow-hidden"
        }`}
        style={{ transitionProperty: "width, opacity" }}
      >
        <h1 className="text-4xl font-bold">Chatterly Chat</h1>
        {messages.map((message, index) => (
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
              <p className="text-white">{message.content}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-white">
            Empieza a hablar con Chatterly para practicar tus habilidades de
            inglés.
          </p>
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
