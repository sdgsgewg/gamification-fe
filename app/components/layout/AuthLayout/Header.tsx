"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  const handleNavigateToHomePage = () => {
    router.push("/");
  };

  return (
    <header className="bg-[#556FD7] shadow-lg px-6 py-4 fixed top-0 left-0 w-full z-50">
      <h1
        className="text-white text-2xl font-bold uppercase cursor-pointer"
        onClick={handleNavigateToHomePage}
      >
        Gamification
      </h1>
    </header>
  );
};

export default Header;
