# 📘 Chatterly App

## 🗣️ Chatterly — Practice English with AI Conversations

Chatterly is a voice-based web application designed to help users improve their spoken English by conversing with an AI in real-time. Using speech recognition and synthesis, it provides an interactive and immersive learning experience directly in the browser.

## 🚀 Live Preview

[Chatterly App online now](https://chatterly-app.vercel.app/)

## 🛠️ Tech Stack

- Next.js — React framework for building the frontend
- TailwindCSS — Utility-first CSS framework, styled with a neobrutalist UI
- Clerk — Authentication (Email/password, Google, GitHub, Twitch, etc.)
- Zustand — Lightweight global state management
- Web Speech API
- SpeechRecognition — Converts user voice into text
- SpeechSynthesis — Converts AI text replies into spoken responses
- Supabase (soon) — Will store conversations, context, and user metadata

## 📦 Features

- 🎤 Voice input via browser-native SpeechRecognition
- 🧠 AI-based conversation with initial context to simulate natural chat
- 🔊 Text-to-Speech replies from the assistant
- ✅ Authentication with Clerk (OAuth + email/password)
- 💬 Chat UI with real-time scroll and neobrutalist visual style
- 💾 State managed with Zustand

## ✨ Features to Come

- 🌍 Multilingual support — Practice in other languages besides English
- 🎙️ Advanced voice options — Different tones, genders, and languages
- 🧠 Conversation context persistence — Save past chats with Supabase
- 🌘 Dark mode
- 🔐 Protected pages for user-specific content using Clerk auth
- 📊 Progress tracking dashboard
- 📁 Organized conversation history
- 🎯 Conversation themes & levels (Beginner, Travel, Business…)
