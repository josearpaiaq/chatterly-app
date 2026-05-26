import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Groq API not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "canopylabs/orpheus-v1-english",
        voice: "autumn",
        input: text,
        response_format: "wav",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Groq TTS error:", res.status, errorText);
      return NextResponse.json(
        { error: "Groq TTS request failed" },
        { status: res.status },
      );
    }

    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS request failed" }, { status: 500 });
  }
}
