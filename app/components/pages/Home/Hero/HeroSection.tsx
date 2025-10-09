"use client";

import { IMAGES } from "@/app/constants/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  SideBySideContentSection,
  SideBySideContentSectionProps,
} from "../Section";
import { Role } from "@/app/enums/Role";
import { auth } from "@/app/functions/AuthProvider";
import Button from "@/app/components/shared/Button";
import { ROUTES } from "@/app/constants/routes";

const HeroSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role>(Role.GUEST);

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      setUserRole(user.role.name);
    } else {
      setUserRole(Role.GUEST);
    }
  }, []);

  const handleClickStartNow = () => {
    if (userRole === Role.GUEST) {
      router.push(ROUTES.AUTH.LOGIN);
    } else {
      router.push(ROUTES.ROOT.ACTIVITY);
    }
  };

  const HeroStaticImage = () => {
    return (
      <div className="w-[90%] sm:w-[55%] lg:w-[45%]">
        <Image
          src={IMAGES.HERO}
          alt="Hero Static Image"
          width={1000}
          height={1000}
        />
      </div>
    );
  };

  const HeroTextContent = () => {
    return (
      <div className="w-full lg:w-[55%] flex flex-col">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
          Buat Belajar Lebih Seru. <br /> Raih Nilai Lebih Tinggi.
        </h2>
        <p className="text-gray-600 text-base font-medium">
          Sistem belajar berbasis game untuk kamu yang suka tantangan. Kerjakan
          tugas, kumpulkan badge, dan dominasi leaderboard.
        </p>
        <div className="flex [@media(max-width:380px)]:flex-col flex-row sm:flex-row gap-4 mt-8">
          <Button
            type="primary"
            size="large"
            variant="primary"
            className="!p-6 !rounded-[1.25rem]"
            onClick={handleClickStartNow}
          >
            <span className="text-white font-bold">Mulai Sekarang</span>
          </Button>
          {/* <button
            onClick={handleClickSeeFeature}
            className="bg-[#D7D3FF] text-[#556FD7] font-bold rounded-[1.25rem] px-6 py-3 hover:bg-[#c9c4ff] transition duration-300 ease-in-out cursor-pointer"
          >
            Lihat Fitur
          </button> */}
        </div>
      </div>
    );
  };

  const heroSectionContent: SideBySideContentSectionProps = {
    left: <HeroStaticImage />,
    right: <HeroTextContent />,
  };

  return <SideBySideContentSection {...heroSectionContent} />;
};

export default HeroSection;
