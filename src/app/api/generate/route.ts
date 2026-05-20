import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { Message } from "@/features/chat/types";

const SYSTEM_PROMPT = `You are Chatterly, a voice-based English conversation practice app.

Rules:
- Keep every response under 2 sentences. This is a voice app — brevity is critical.
- English only. Plain text only — no markdown, no lists, no symbols.
- End each response with one short follow-up question to keep the conversation going.
- Gently correct grammar mistakes when relevant, in a natural way.
- Never discuss explicit, illegal, or sensitive topics.`;

const MAX_CONTEXT = 8;

export async function POST(request: Request) {
  const body: { messages: Message[] } = await request.json();

  if (!body.messages?.length) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const conversation = body.messages
      .filter(({ role }) => role !== "system")
      .slice(-MAX_CONTEXT)
      .map(({ role, content }) => ({ role, content }));

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...conversation],
    });

    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
