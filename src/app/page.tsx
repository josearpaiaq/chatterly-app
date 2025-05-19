import Chat from "@/pages/ChatPage";
import LandingPage from "@/pages/LandingPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-screen bg-gray-600">
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <Chat />
      </SignedIn>
    </div>
  );
}
