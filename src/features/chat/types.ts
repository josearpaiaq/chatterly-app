export type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
};

export type Chat = {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

export type AppSettings = {
  voice: string;
  speechRate: number;
  autoReplay: boolean;
  theme: "dark" | "light" | "auto";
  micButtonSize: "normal" | "large";
  targetLanguage: string;
  correctionLevel: "subtle" | "aggressive";
};
