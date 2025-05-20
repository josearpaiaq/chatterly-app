"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
// import BurgerMenu from "./BurgerMenu";
import useChatterlyStore from "@/store";
import { PanelRight } from "lucide-react";

export default function Navbar() {
  const { sidebar, setSidebar } = useChatterlyStore();

  return (
    <header className="p-4 bg-gray-900/50">
      <SignedIn>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <PanelRight
              className="text-white cursor-pointer -rotate-90 md:rotate-180"
              size={24}
              onClick={() => setSidebar(!sidebar)}
            />
            {/* <BurgerMenu isOpen={false} setIsOpen={() => {}} /> */}
          </div>
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
