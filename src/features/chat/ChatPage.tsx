"use client";

import { useState } from "react";
import SideChat from "@/features/chat/components/SideChat";
import VoiceRecorderButton from "@/features/voice/components/VoiceRecorderButton";
import MobileChatSheet from "@/features/chat/components/MobileChatSheet";

export const dynamic = "force-dynamic";

export default function Chat() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="relative flex h-full w-screen overflow-hidden bg-gray-600">
      {/* Desktop sidebar */}
      <SideChat />

      {/* Mic — desktop: always. Mobile: fades out when sheet opens */}
      <div
        className={`flex items-center justify-center h-full w-full background-animation transition-opacity duration-300 ${
          sheetOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <VoiceRecorderButton />
      </div>

      {/* Mobile bottom sheet (hidden on md+) */}
      <MobileChatSheet onOpenChange={setSheetOpen} />
    </div>
  );
}
