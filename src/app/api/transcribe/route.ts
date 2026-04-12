import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio") as File | null;

  if (!audio) {
    return NextResponse.json({ error: "Audio is required" }, { status: 400 });
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3",
      language: "en",
      response_format: "json",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
