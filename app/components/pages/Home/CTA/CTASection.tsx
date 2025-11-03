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
import { useAuth } from "@/app/hooks/useAuth";
import Button from "@/app/components/shared/Button";
import { ROUTES } from "@/app/constants/routes";

const CTASection = () => {
  const router = useRouter();
  const { getCachedUserProfile } = useAuth();

  const user = getCachedUserProfile();
  const userRole = user?.role.name ?? Role.GUEST;
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");

  useEffect(() => {
    if (userRole === Role.GUEST) {
      setTitle("Belajar Lebih Seru & Interaktif");
      setSubtitle(
        "Buat akunmu sekarang untuk kumpulkan XP serta badge dari berbagai aktivitas dan bergabung dalam leaderboard!"
      );
    } else {
      setTitle("Siap Menyelesaikan Tantangan Hari Ini?");
      setSubtitle(
        "Kumpulkan XP dari tugas dan game yang tersedia. Selesaikan tantanganmu dan pantau progres belajarmu."
      );
    }
  }, [userRole]);

  const handleClickStartNow = () => {
    if (userRole === Role.GUEST) {
      router.push(ROUTES.AUTH.LOGIN);
    } else {
      router.push(ROUTES.ROOT.ACTIVITY);
    }
  };

  const CTATextContent = () => {
    return (
      <div className="w-full lg:w-[55%] flex flex-col">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">{title}</h2>
        <p className="text-tx-secondary text-base font-medium">{subtitle}</p>
        <div className="flex [@media(max-width:380px)]:flex-col flex-row sm:flex-row gap-4 mt-8">
          <Button
            type="primary"
            size="large"
            variant="primary"
            className="!p-6 !rounded-[1.25rem]"
            onClick={handleClickStartNow}
          >
            <span className="font-bold">Mulai Sekarang</span>
          </Button>
        </div>
      </div>
    );
  };

  const CTAStaticImage = () => {
    return (
      <div className="w-[90%] sm:w-[30%] lg:w-[20%]">
        <Image
          src={IMAGES.CTA}
          alt="CTA Static Image"
          width={500}
          height={500}
        />
      </div>
    );
  };

  const CTASectionContent: SideBySideContentSectionProps = {
    left: <CTATextContent />,
    right: <CTAStaticImage />,
  };

  return <SideBySideContentSection {...CTASectionContent} />;
};

export default CTASection;
