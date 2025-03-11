"use client";

import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { navMenu } from "./navmenu";
import { useRouter } from "next/navigation";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Disable scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Icon */}
      <button onClick={toggleMenu} className="text-2xl sm:hidden cursor-pointer">
        <RxHamburgerMenu />
      </button>

      {/* Sidebar Menu (Appears from the Right) */}
      <div
        className={`fixed top-0 right-0 h-screen w-1/2 bg-white z-50 text-black shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={closeMenu} className="text-2xl cursor-pointer">
            <IoMdClose />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 pl-6 mt-6">
          {navMenu.map((item) => (
            <div
              onClick={() => {
                router.push(item?.link);
                closeMenu();
              }}
              className="text-lg font-bold cursor-pointer hover:text-gray-700 transition"
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay (Closes menu when clicked) */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}
    </>
  );
}
