import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import BurgerMenu from "@/components/BurgerMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatterly",
  description:
    "Chatterly is a voice chat app that allows you to speak with an IA to practice your english skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
        >
          <header className="flex justify-between items-center p-4 gap-4">
            <SignedIn>
              <BurgerMenu />
            </SignedIn>
            <div className="flex justify-end items-center gap-4">
              <SignedOut>
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
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          <main className="flex-1 w-full overflow-y-auto">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
