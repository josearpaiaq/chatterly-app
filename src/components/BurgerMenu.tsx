"use client";

import { useState } from "react";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`w-5 h-5 flex flex-col items-center ${
        isOpen ? "justify-center" : "justify-evenly"
      } cursor-pointer transition-all duration-300`}
      onClick={toggleMenu}
    >
      <div
        className={`w-full h-0.5 bg-white transition-all duration-300 ${
          isOpen ? "-rotate-45" : ""
        }`}
      ></div>
      <div
        className={`w-full h-0.5 bg-white transition-all duration-300 ${
          isOpen ? "hidden" : ""
        }`}
      ></div>
      <div
        className={`w-full h-0.5 bg-white transition-all duration-300 ${
          isOpen ? "rotate-45 -m-0.5" : ""
        }`}
      ></div>
    </div>
  );
}
