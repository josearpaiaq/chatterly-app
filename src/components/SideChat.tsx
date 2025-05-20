import { LANG } from "@/lib/constants";
import useChatterlyStore from "@/store";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const synth = window.speechSynthesis;
synth?.cancel();

export default function SideChat() {
  const { sidebar, messages, setMessages } = useChatterlyStore();
  const [currentMessage, setCurrentMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (currentMessage.trim() !== "") {
        const newMessages = [
          ...messages,
          { role: "user", content: currentMessage },
        ];

        setMessages({ role: "user", content: currentMessage });

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        const { result } = await res.json();

        setMessages({ role: "assistant", content: result });

        const utterance = new SpeechSynthesisUtterance(result);
        utterance.lang = LANG;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        synth?.speak(utterance);

        setCurrentMessage("");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container && sidebar) {
      // container.scrollTop = container.scrollHeight;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, sidebar]);

  return (
    <div
      className={`relative bg-gray-900 transition-all duration-500 ease-in-out overflow-auto h-full ${
        sidebar
          ? "md:static z-50 w-full md:w-4/12 lg:w-6/12 opacity-100 p-4"
          : "hidden md:block md:w-0 md:opacity-0 md:pointer-events-none md:overflow-hidden p-0"
      }`}
      style={{ transitionProperty: "width, opacity" }}
      ref={scrollRef}
    >
      <div className="sticky left-1.5 top-1.5 bg-transparent p-1">
        <h1 className="text-lg sm:text-2xl font-bold text-white">
          Chatterly Chat
        </h1>
      </div>
      <div className="pt-8 h-max flex flex-col items-center justify-start overflow-auto">
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
      </div>

      <form
        className="sticky bottom-0 right-0 flex justify-center items-center w-full gap-1"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button
          className="bg-gray-800 text-white rounded-lg px-4 py-2"
          type="submit"
        >
          <Send className="text-white" size={24} />
        </button>
      </form>

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
  );
}
