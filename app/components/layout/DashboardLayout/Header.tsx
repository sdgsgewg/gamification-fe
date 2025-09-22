"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { auth } from "@/app/functions/AuthProvider";

const UserGreetSection = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      // kalau belum punya profile, fetch dulu
      if (!auth.userProfile) {
        await auth.fetchUserProfile();
      }

      console.log("User: ", auth.userProfile);

      const name = auth.userProfile?.name || "Pengguna";
      setUsername(name);
    };

    loadUser();
  }, []);

  return (
    <div className="flex items-center gap-3 ms-auto text-white">
      <Image src={"/img/profile.png"} alt={"Profile"} width={32} height={32} />
      <p className="text-base font-medium">Halo, {username}</p>
    </div>
  );
};

interface HeaderProps {
  onToggle: () => void;
}

const Header = ({ onToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 h-16 flex items-center gap-4 bg-[#556FD7] text-white px-6 py-4">
      <div className="lg:hidden">
        <button className="cursor-pointer" onClick={onToggle}>
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
      </div>
      <UserGreetSection />
    </header>
  );
};

export default Header;
