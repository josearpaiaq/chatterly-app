"use client";

import { Mic, MicOff } from "lucide-react";
import { LANG } from "@/lib/constants";
import useChatterlyStore from "@/store";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const synth = window.speechSynthesis;
synth?.cancel();

export default function VoiceRecorderButton() {
  const { messages, setMessages } = useChatterlyStore();
  const {
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    transcript,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  const startRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: LANG });
  };

  const stopRecording = async () => {
    try {
      SpeechRecognition.stopListening();

      const newMessages = [...messages, { role: "user", content: transcript }];

      setMessages({ role: "user", content: transcript });

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const { result } = await res.json();

      setMessages({ role: "assistant", content: result });

      const utterance = new SpeechSynthesisUtterance(result);
      utterance.lang = LANG;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      synth?.speak(utterance);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  return (
    <div
      onClick={listening ? stopRecording : startRecording}
      className={`w-60 h-60 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-all duration-300
        ${
          listening
            ? "bg-red-500 animate-pulse shadow-lg"
            : "bg-blue-500 hover:bg-blue-600 shadow"
        }
      `}
    >
      {listening ? (
        <MicOff className="text-white" size={48} />
      ) : (
        <Mic className="text-white" size={48} />
      )}
    </div>
  );
}
