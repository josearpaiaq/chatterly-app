"use client";

import useChatterlyStore from "@/features/chat/store";
import ChatNavigator from "./ChatNavigator";

export default function SideChat() {
  const { sidebar } = useChatterlyStore();

  return (
    <div
      className={`hidden md:flex flex-col bg-gray-900 h-full overflow-hidden transition-all duration-500 ease-in-out ${
        sidebar
          ? "w-5/12 lg:w-4/12 opacity-100"
          : "w-0 opacity-0 pointer-events-none"
      }`}
      style={{ transitionProperty: "width, opacity" }}
    >
      <ChatNavigator />
    </div>
  );
}
