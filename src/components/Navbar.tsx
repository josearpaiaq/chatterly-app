"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import BurgerMenu from "./BurgerMenu";
import useChatterlyStore from "@/store";

export default function Navbar() {
  const { sidebar, setSidebar } = useChatterlyStore();

  return (
    <header className="p-4 bg-gray-900/50">
      <SignedIn>
        <div className="flex justify-between items-center gap-4">
          <BurgerMenu isOpen={sidebar} setIsOpen={setSidebar} />
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
