import Chat from "@/views/ChatPage";
import LandingPage from "@/views/LandingPage";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "@/styles/bg-animation.css";

export default function Home() {
  return (
    <ClerkProvider>
      <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
        <div className="flex flex-col items-center justify-center h-full w-screen">
          <SignedOut>
            <LandingPage />
          </SignedOut>

          <SignedIn>
            <Chat />
          </SignedIn>
        </div>
      </div>
    </ClerkProvider>
  );
}
