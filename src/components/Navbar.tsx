"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
// import BurgerMenu from "./BurgerMenu";
import useChatterlyStore from "@/features/chat/store";
import { PanelRight } from "lucide-react";

export default function Navbar() {
  const { sidebar, setSidebar } = useChatterlyStore();

  return (
    <header className="relative z-50 p-4 bg-gray-900/80 backdrop-blur-sm">
      <SignedIn>
        <div className="flex justify-between items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <PanelRight
              className="text-white cursor-pointer rotate-180"
              size={24}
              onClick={() => setSidebar(!sidebar)}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Chatterly App</h1>
          </div>

          <div>
            <UserButton />
          </div>
        </div>
      </SignedIn>
    </header>
  );
}
