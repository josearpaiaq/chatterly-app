"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import BurgerMenu from "./BurgerMenu";
import useChatterlyStore from "@/store";

export default function Navbar() {
  const { sidebar, setSidebar } = useChatterlyStore();

  return (
    <header className="p-4 bg-gray-900/50">
      <SignedOut>
        <div className="flex justify-end items-center gap-4">
          <SignInButton mode="modal">
            <span className="text-sm mt-2 font-bold cursor-pointer bg-amber-50 border-0 border-amber-500 rounded px-4 py-2 text-amber-950 hover:bg-amber-100 transition-all duration-300">
              Sign In
            </span>
          </SignInButton>
          <SignUpButton mode="modal">
            <span className="text-sm mt-2 font-bold cursor-pointer bg-amber-50 border-0 border-amber-500 rounded px-4 py-2 text-amber-950 hover:bg-amber-100 transition-all duration-300">
              Sign up
            </span>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex justify-between items-center gap-4">
          <BurgerMenu isOpen={sidebar} setIsOpen={setSidebar} />
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
