"use client";

import { LANG } from "./constants";

const synth = window.speechSynthesis;

export const playMessage = (message: string, onend?: () => void) => {
  synth?.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = LANG;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  synth?.speak(utterance);

  utterance.onend = () => {
    onend?.();
  };
};

export const cancalPlayMessage = () => {
  synth?.cancel();
};
