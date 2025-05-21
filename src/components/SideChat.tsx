import useChatterlyStore from "@/store";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Message from "./Message";
import { playMessage } from "@/lib/synthesis";

export default function SideChat() {
  const { sidebar, messages, setMessages, deleteMessage } = useChatterlyStore();
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

        setCurrentMessage("");

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        const { result } = await res.json();

        setMessages({ role: "assistant", content: result });

        playMessage(result);
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const onDeleteMessage = (content: string) => {
    deleteMessage(content);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container && sidebar) {
      container.scrollTo({
        top: container.scrollHeight + 10,
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
      <div className="sticky left-1.5 -top-4.5 p-1 w-full bg-gray-900 ">
        <h1 className="text-lg sm:text-2xl font-bold text-white">Chat</h1>
      </div>

      {messages.filter((_, i) => i !== 0).length !== 0 && (
        <div
          className={[
            " h-max flex flex-col items-center justify-start overflow-auto",
            messages.length === 1 ? "pt-8" : "",
          ].join(" ")}
        >
          {messages
            .filter((_, i) => i !== 0)
            .map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } w-full`}
              >
                <Message
                  role={message.role}
                  message={message.content}
                  onDelete={() => onDeleteMessage(message.content)}
                />
              </div>
            ))}
        </div>
      )}

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

      <form
        className="sticky bottom-0 right-0 flex justify-center items-center w-full gap-1 mt-4 px-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button
          className="bg-green-500 text-white rounded-lg px-4 py-2"
          type="submit"
        >
          <Send className="text-white" size={24} />
        </button>
      </form>
    </div>
  );
}
