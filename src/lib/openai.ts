import { OpenAI } from "openai";

// Groq uses an OpenAI-compatible API — no extra SDK needed
const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;
