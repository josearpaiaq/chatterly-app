import VoiceRecorderButton from "@/components/VoiceRecorderButton";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-screen bg-gray-600">
      <SignedOut>
        <h1 className="text-4xl font-bold">Chatterly</h1>
        <h2>Inicia sesión para usar Chatterly y empezar a hablar con tu IA.</h2>

        <SignInButton mode="modal">
          <span className="text-sm mt-2 font-bold cursor-pointer bg-amber-50 border-0 border-amber-500 rounded px-4 py-2 text-amber-950">
            Iniciar sesión
          </span>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <VoiceRecorderButton />
      </SignedIn>
    </div>
  );
}
