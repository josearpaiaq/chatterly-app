// components/VoiceRecorderButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

// 👇 Esto lo puedes poner al inicio del archivo o en types.d.ts
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

export default function VoiceRecorderButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.lang = "es-ES";
        recog.continuous = false;
        recog.interimResults = false;
        recog.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          console.log("Transcripción:", transcript);
          // Aquí puedes enviar el texto a tu backend o a la IA
        };
        recog.onend = () => {
          setIsRecording(false);
        };
        setRecognition(recog);
      } else {
        alert("Tu navegador no soporta SpeechRecognition 😥");
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <button
      onClick={toggleRecording}
      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
        ${
          isRecording
            ? "bg-red-500 animate-pulse shadow-lg"
            : "bg-blue-500 hover:bg-blue-600 shadow"
        }
      `}
    >
      {isRecording ? (
        <MicOff className="text-white" size={28} />
      ) : (
        <Mic className="text-white" size={28} />
      )}
    </button>
  );
}
