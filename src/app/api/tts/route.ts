import { NextResponse } from "next/server";

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION!;

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
    return NextResponse.json(
      { error: "Azure Speech not configured" },
      { status: 500 }
    );
  }

  const escaped = text.replace(
    /[<>&'"]/g,
    (c: string) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] ?? c)
  );

  const ssml = `
    <speak version='1.0'
      xmlns='http://www.w3.org/2001/10/synthesis'
      xmlns:mstts='http://www.w3.org/2001/mstts'
      xml:lang='en-US'>
      <voice name='en-US-AriaNeural'>
        <mstts:express-as style='chat'>
          <prosody rate='5%' pitch='0%'>
            ${escaped}
          </prosody>
        </mstts:express-as>
      </voice>
    </speak>
  `;

  try {
    const res = await fetch(
      `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
        },
        body: ssml,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Azure TTS error:", res.status, errorText);
      return NextResponse.json(
        { error: "Azure TTS request failed" },
        { status: res.status }
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
