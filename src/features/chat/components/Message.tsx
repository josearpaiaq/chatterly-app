"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Trash, Volume2 } from "lucide-react";
import { playMessage } from "@/features/voice/lib/synthesis";
import useChatterlyStore from "@/features/chat/store";

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

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setConfirmOpen(false)}
    >
      <div
        className="bg-gray-800 rounded-2xl p-6 mx-4 w-full max-w-sm shadow-xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-base font-medium text-center">
          Delete this message?
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 rounded-xl bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors"
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-400 transition-colors"
            onClick={() => { onDelete(); setConfirmOpen(false); }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

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

      {confirmOpen && createPortal(modal, document.body)}
    </>
  );
}
