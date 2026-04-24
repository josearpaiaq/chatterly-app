"use client";

import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-gray-800 rounded-2xl p-6 mx-4 w-full max-w-sm shadow-xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-base font-medium text-center">{message}</p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 rounded-xl bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-400 transition-colors"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
