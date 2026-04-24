"use client";

import { useRef, useState } from "react";
import ChatNavigator from "./ChatNavigator";

interface Props {
  onOpenChange: (open: boolean) => void;
}

const HANDLE_HEIGHT = 56;

export default function MobileChatSheet({ onOpenChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const toggle = (next: boolean) => {
    setIsOpen(next);
    onOpenChange(next);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 40) toggle(true);
    else if (delta < -40) toggle(false);
    touchStartY.current = null;
  };

  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-gray-900 rounded-t-2xl overflow-hidden"
      style={{
        height: "calc(100% - 64px)",
        transform: isOpen
          ? "translateY(0)"
          : `translateY(calc(100% - ${HANDLE_HEIGHT}px))`,
        transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      {/* Handle bar — swipe/tap target */}
      <div
        className="flex flex-col items-center pt-3 pb-2 cursor-pointer select-none shrink-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => toggle(!isOpen)}
      >
        <div className="w-10 h-1 rounded-full bg-gray-600 mb-2" />
        {!isOpen && (
          <span className="text-gray-400 text-xs tracking-wide">Your Chats</span>
        )}
      </div>

      {/* Navigator fills remaining height */}
      <div
        className="overflow-hidden"
        style={{ height: `calc(100% - ${HANDLE_HEIGHT}px)` }}
      >
        <ChatNavigator showMicInList compactMicInChat />
      </div>
    </div>
  );
}
