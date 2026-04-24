"use client";

let currentAudio: HTMLAudioElement | null = null;

export const playMessage = async (
  message: string,
  onend?: () => void
): Promise<void> => {
  if (typeof window === "undefined") return;

  // Cancel any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });

  if (!res.ok) {
    throw new Error("TTS request failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;

  audio.onended = () => {
    URL.revokeObjectURL(url);
    currentAudio = null;
    onend?.();
  };

  audio.play();
};

export const cancelPlayMessage = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
};
