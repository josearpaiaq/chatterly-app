"use client";

import SideChat from "@/components/SideChat";
import VoiceRecorderButton from "@/components/VoiceRecorderButton";

export const dynamic = "force-dynamic";

export default function Chat() {
  return (
    <div className="relative flex flex-col sm:flex-row h-full w-screen bg-gray-600 transition-all duration-300">
      <SideChat />
      <div className="flex items-center justify-center h-full transition-all duration-500 ease-in-out w-full background-animation">
        <VoiceRecorderButton />
      </div>
    </div>
  );
}
