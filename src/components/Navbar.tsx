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
    <header className="p-4 bg-gray-900/30">
      <SignedOut>
        <div className="flex justify-end items-center gap-4">
          <SignInButton mode="modal">
            <span className="text-sm font-bold cursor-pointer">
              Inicia sesión
            </span>
          </SignInButton>
          <SignUpButton mode="modal">
            <span className="text-sm font-bold cursor-pointer">
              Registrarse
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
