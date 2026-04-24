import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen background-animation">
      <h1 className="text-4xl font-bold">Chatterly</h1>
      <h2 className="text-xl sm:text-2xl my-4 px-4 text-balance text-center">
        Improve your english with AI and voice conversations
      </h2>

      <div className="flex items-center justify-center gap-4">
        <SignInButton mode="modal">
          <span className="text-sm mt-2 font-bold cursor-pointer bg-amber-50 border-0 border-amber-500 rounded px-4 py-2 text-amber-950 hover:bg-amber-100 transition-all duration-300">
            Log in
          </span>
        </SignInButton>
        <SignUpButton mode="modal">
          <span className="text-sm mt-2 font-bold cursor-pointer bg-amber-50 border-0 border-amber-500 rounded px-4 py-2 text-amber-950 hover:bg-amber-100 transition-all duration-300">
            Register
          </span>
        </SignUpButton>
      </div>
    </div>
  );
}
