"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet } from "react-modal-sheet";
import ChatNavigator from "./ChatNavigator";

interface Props {
  onOpenChange: (open: boolean) => void;
}

// Library requires snapPoints to start with 0 (closed) and end with 1 (full open)
const SNAP_CLOSED = 0;
const SNAP_PEEK = 1;
const SNAP_FULL = 2;

export default function MobileChatSheet({ onOpenChange }: Props) {
  const [snapIndex, setSnapIndex] = useState(SNAP_PEEK);
  const [isMobile, setIsMobile] = useState(false);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleSnap = (index: number) => {
    if (index === SNAP_CLOSED) {
      // Sheet should never fully disappear — bounce back to peek
      sheetRef.current?.snapTo(SNAP_PEEK);
      return;
    }
    setSnapIndex(index);
    onOpenChange(index === SNAP_FULL);
  };

  if (!isMobile) return null;

  return (
    <Sheet
      ref={sheetRef}
      isOpen
      onClose={() => sheetRef.current?.snapTo(SNAP_PEEK)}
      snapPoints={[0, 56, 1]}
      initialSnap={SNAP_PEEK}
      onSnap={handleSnap}
    >
      <Sheet.Container
        style={{
          backgroundColor: "#111827",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      >
        <Sheet.Header>
          <div className="flex flex-col items-center pt-3 pb-1">
            <Sheet.DragIndicator />
            {snapIndex === SNAP_PEEK && (
              <span className="text-gray-400 text-xs tracking-wide mt-1">
                Your Chats
              </span>
            )}
          </div>
        </Sheet.Header>
        <Sheet.Content
          disableDrag={({ scrollPosition }) => scrollPosition !== "top"}
        >
          <ChatNavigator showMicInList compactMicInChat />
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
