"use client";

import { useState } from "react";
import { Trash, Volume2 } from "lucide-react";
import { playMessage } from "@/features/voice/lib/synthesis";
import useChatterlyStore from "@/features/chat/store";
import ConfirmModal from "@/components/ConfirmModal";

export default function Message({
  role,
  message,
  onDelete,
}: {
  role: "user" | "assistant";
  message: string;
  onDelete: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { setIsAISpeaking } = useChatterlyStore();

  const handleReplay = () => {
    setIsAISpeaking(true);
    playMessage(message, () => setIsAISpeaking(false));
  };

  return (
    <>
      <div
        className={`flex flex-col justify-center p-4 rounded-lg my-2 max-w-[75%] ${
          role === "user" ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        <p className="text-white">{message || "..."}</p>

        <div className="flex justify-end items-center mt-2 gap-3">
          <Volume2
            className="text-white cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            size={16}
            onClick={handleReplay}
          />
          <Trash
            className="text-white cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            size={16}
            onClick={() => setConfirmOpen(true)}
          />
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        message="Delete this message?"
        confirmLabel="Delete"
        onConfirm={() => { onDelete(); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
