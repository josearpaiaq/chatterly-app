import { SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Chatterly</h1>
      <h2 className="text-2xl my-4">
        Improve your english with AI and voice conversations
      </h2>

      <SignInButton mode="modal">
        <span className="text-sm mt-2 font-bold cursor-pointer bg-amber-50 border-0 border-amber-500 rounded px-4 py-2 text-amber-950 hover:bg-amber-100 transition-all duration-300">
          Start your journey
        </span>
      </SignInButton>
    </div>
  );
}
