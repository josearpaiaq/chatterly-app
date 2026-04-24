import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { Message } from "@/features/chat/types";

interface GenerateRequest {
  messages: Message[];
}

export async function POST(request: Request) {
  const body: GenerateRequest = await request.json();

  if (!body.messages.length) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // How many recent conversation messages to keep (excluding system prompt)
  const MAX_CONTEXT = 8;

  try {
    const all = body.messages.map(({ role, content }) => ({ role, content }));

    // Always include system prompt + last MAX_CONTEXT conversation messages
    const [system, ...conversation] = all;
    const trimmed = [system, ...conversation.slice(-MAX_CONTEXT)];

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: trimmed,
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
