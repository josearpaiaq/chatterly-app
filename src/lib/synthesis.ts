import { LANG } from "./constants";

const synth = window?.speechSynthesis;

const startSpeaking = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  synth?.speak(utterance);
};

const stopSpeaking = () => {
  synth?.cancel();
};

export default { startSpeaking, stopSpeaking };
