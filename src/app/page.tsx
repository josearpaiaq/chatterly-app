import Chat from "@/views/ChatPage";
import LandingPage from "@/views/LandingPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-screen">
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <Chat />
      </SignedIn>
    </div>
  );
}
