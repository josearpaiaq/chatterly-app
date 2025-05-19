import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { Message } from "@/types";

interface GenerateRequest {
  messages: Message[];
}

export async function POST(request: Request) {
  const body: GenerateRequest = await request.json();

  if (!body.messages.length) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: body.messages,
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
