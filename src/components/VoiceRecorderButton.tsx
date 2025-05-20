"use client";

import { Mic, MicOff, Pause } from "lucide-react";
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
    // finalTranscript,
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

      utterance.onend = () => {
        console.log("onend and restart recording");
        startRecording();
      };
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const handlePause = () => {
    synth?.cancel();
    SpeechRecognition.stopListening();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        onClick={listening ? stopRecording : startRecording}
        className={`cursor-pointer w-60 h-60 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-all duration-300
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

      <div className="text-center text-sm text-gray-500 mt-6 sm:mt-2">
        <Pause
          className="text-white cursor-pointer"
          size={28}
          onClick={handlePause}
        />
      </div>

      {/* <div>transcript: {transcript}</div>
      <div>finalTranscript: {finalTranscript}</div> */}
    </div>
  );
}
