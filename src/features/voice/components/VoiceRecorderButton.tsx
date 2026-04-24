"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Pause } from "lucide-react";
import useChatterlyStore from "@/features/chat/store";
import { cancelPlayMessage, playMessage } from "@/features/voice/lib/synthesis";

const SILENCE_THRESHOLD = 15;   // avg frequency amplitude (0–255)
const SILENCE_DURATION_MS = 1800;
const POLL_INTERVAL_MS = 100;

function getSupportedMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

interface Props {
  compact?: boolean;
}

export default function VoiceRecorderButton({ compact = false }: Props) {
  const { addMessage } = useChatterlyStore();
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceDurationRef = useRef(0);
  const hasSpeechRef = useRef(false);

  // Always-current messages via store getter — avoids stale closure in callbacks
  const getMessages = () => {
    const { chats, activeChatId } = useChatterlyStore.getState();
    return chats.find((c) => c.id === activeChatId)?.messages ?? [];
  };

  const cleanup = () => {
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const stopRecorder = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Transcribe with Groq Whisper
      const formData = new FormData();
      formData.append("audio", blob, "audio.webm");

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) throw new Error("Transcription failed");

      const { text } = await transcribeRes.json();

      if (!text?.trim()) {
        // Nothing recognized — restart listening
        setIsLoading(false);
        startRecording();
        return;
      }

      // 2. Generate AI response
      const messages = getMessages();
      const userMessage = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: text,
      };
      addMessage(userMessage);

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!generateRes.ok) throw new Error("Failed to get response from AI");

      const { result } = await generateRes.json();

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: result,
      });

      setIsLoading(false);
      useChatterlyStore.getState().setIsAISpeaking(true);
      playMessage(result, () => {
        useChatterlyStore.getState().setIsAISpeaking(false);
        startRecording();
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    hasSpeechRef.current = false;
    silenceDurationRef.current = 0;
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();

      // AudioContext for silence detection
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        cleanup();
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (hasSpeechRef.current && blob.size > 0) {
          processAudio(blob);
        }
      };

      mediaRecorder.start(100);
      setIsListening(true);

      // Silence detection loop
      silenceIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (avg > SILENCE_THRESHOLD) {
          hasSpeechRef.current = true;
          silenceDurationRef.current = 0;
        } else if (hasSpeechRef.current) {
          silenceDurationRef.current += POLL_INTERVAL_MS;

          if (silenceDurationRef.current >= SILENCE_DURATION_MS) {
            // Prolonged silence after speech → stop and transcribe
            clearInterval(silenceIntervalRef.current!);
            silenceIntervalRef.current = null;
            setIsListening(false);
            stopRecorder();
          }
        }
      }, POLL_INTERVAL_MS);
    } catch {
      setError("Microphone access denied.");
    }
  };

  const handleClick = () => {
    if (isLoading) return;
    if (isListening) {
      // Manual stop — force process whatever was recorded
      hasSpeechRef.current = true;
      cleanup();
      setIsListening(false);
      stopRecorder();
    } else {
      startRecording();
    }
  };

  const handlePause = () => {
    cancelPlayMessage();
    hasSpeechRef.current = false;
    cleanup();
    setIsListening(false);
    stopRecorder();
  };

  // Cleanup on unmount
  useEffect(() => () => { cleanup(); stopRecorder(); }, []);

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          isLoading
            ? "bg-yellow-500 animate-pulse cursor-not-allowed"
            : isListening
            ? "bg-red-500 animate-pulse cursor-pointer"
            : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isListening ? (
          <MicOff className="text-white" size={18} />
        ) : (
          <Mic className="text-white" size={18} />
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        onClick={handleClick}
        className={`w-60 h-60 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-all duration-300
        ${
          isLoading
            ? "bg-yellow-500 animate-pulse shadow-lg cursor-not-allowed"
            : isListening
            ? "bg-red-500 animate-pulse shadow-lg cursor-pointer"
            : "bg-blue-500 hover:bg-blue-600 shadow cursor-pointer"
        }`}
      >
        {isLoading ? (
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : isListening ? (
          <MicOff className="text-white" size={48} />
        ) : (
          <Mic className="text-white" size={48} />
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-4 text-center max-w-xs">{error}</p>
      )}

      <div className="mt-6 sm:mt-2">
        <Pause
          className="text-white cursor-pointer"
          size={28}
          onClick={handlePause}
        />
      </div>
    </div>
  );
}
