import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full background-animation text-white">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        <Wrench size={56} className="opacity-90 animate-bounce" />

        <h1 className="text-4xl font-bold tracking-tight">
          Under Maintenance
        </h1>

        <p className="text-lg text-white/80 max-w-md text-balance">
          Chatterly is currently down for maintenance. We&apos;re working on
          improvements and will be back shortly.
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
          <span className="inline-block w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          Come back soon
        </div>
      </div>
    </div>
  );
}
