// components/VoiceRecorderButton.tsx
"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

const SpeechRecognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();

SpeechRecognition.continuous = true;
SpeechRecognition.lang = "en-US";

export default function VoiceRecorderButton() {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    SpeechRecognition.start();

    SpeechRecognition.addEventListener("result", handleSpeechResult);
  };

  const handleSpeechResult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    // Aquí puedes enviar la transcripción a tu IA o hacer lo que necesites con ella
  };

  const stopRecording = () => {
    setIsRecording(false);

    SpeechRecognition.stop();
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`w-80 h-80 rounded-full flex items-center justify-center transition-all duration-300
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
