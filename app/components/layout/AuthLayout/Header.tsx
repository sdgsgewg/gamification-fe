"use client";

import { useRouter } from "next/navigation";
import React from "react";
import ThemeSwitcher from "../../shared/ThemeSwitcher";

const Header = () => {
  const router = useRouter();

  const handleNavigateToHomePage = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between bg-primary shadow-lg px-6 py-4 fixed top-0 left-0 w-full z-50">
      <h1
        className="text-white text-2xl font-bold uppercase cursor-pointer"
        onClick={handleNavigateToHomePage}
      >
        Gamification
      </h1>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
