"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { IMAGES } from "@/app/constants/images";

const UserGreetSection = () => {
  const { user } = useGetCachedUser();

  if (!user) return;

  return (
    <div className="flex items-center gap-3 ms-auto">
      <Image
        src={IMAGES.DEFAULT_PROFILE}
        alt={"Profile"}
        width={32}
        height={32}
      />
      <p className="text-white text-base font-medium">Hello, {user.name}</p>
    </div>
  );
};

interface HeaderProps {
  onToggle: () => void;
}

const Header = ({ onToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 h-16 flex items-center gap-4 bg-primary text-light px-6 py-4">
      <div className="lg:hidden">
        <button className="cursor-pointer" onClick={onToggle}>
          <FontAwesomeIcon icon={faBars} className="text-white text-xl" />
        </button>
      </div>
      <UserGreetSection />
    </header>
  );
};

export default Header;
