"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import synth from "@/lib/synthesis";
import { LANG } from "@/lib/constants";
import useChatterlyStore from "@/store";

const SpeechRecognition = new (window?.SpeechRecognition ||
  window?.webkitSpeechRecognition)();

synth?.stopSpeaking();

SpeechRecognition.continuous = true;
SpeechRecognition.lang = LANG;

export default function VoiceRecorderButton() {
  const [isRecording, setIsRecording] = useState(false);
  const { messages, setMessages } = useChatterlyStore();

  const startRecording = () => {
    setIsRecording(true);

    synth?.stopSpeaking();

    SpeechRecognition.start();

    SpeechRecognition.addEventListener("result", handleSpeechResult);
  };

  const handleSpeechResult = async (event: SpeechRecognitionEvent) => {
    try {
      const transcript = event.results[0][0].transcript;

      setMessages({ role: "user", content: transcript });

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      const { result } = await res.json();

      // console.log({ result });

      setMessages({ role: "assistant", content: result });

      synth?.startSpeaking(result);
    } catch (error) {
      console.error("Error handling speech result:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    SpeechRecognition.stop();
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`w-60 h-60 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-all duration-300
        ${
          isRecording
            ? "bg-red-500 animate-pulse shadow-lg"
            : "bg-blue-500 hover:bg-blue-600 shadow"
        }
      `}
    >
      {isRecording ? (
        <MicOff className="text-white" size={48} />
      ) : (
        <Mic className="text-white" size={48} />
      )}
    </button>
  );
}
