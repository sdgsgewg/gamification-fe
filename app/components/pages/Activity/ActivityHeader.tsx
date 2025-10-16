"use client";

import React from "react";
import Image from "next/image";
import Button from "@/app/components/shared/Button";
import { IMAGES } from "@/app/constants/images";
import { useIsTablet } from "@/app/hooks/useIsTablet";
import { useIsDesktop } from "@/app/hooks/useIsDesktop";

interface ActivityHeaderProps {
  formId: string;
  children: React.ReactNode;
  onResetFilters: () => void;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  formId,
  children,
  onResetFilters,
}) => {
  const { isMediumTablet } = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <div className="relative h-72 xs:h-76 md:h-96 flex items-center px-8 md:px-12 xl:px-20 text-white overflow-hidden">
      <Image
        src={IMAGES.ACTIVITY}
        alt="Activity Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 w-full flex flex-col items-start gap-8">
        <div className="w-full flex flex-col gap-2 sm:gap-4 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold">Aktivitas Belajar</h1>
          <p className="text-base font-medium">
            Temukan berbagai tugas, quiz, dan game seru!
          </p>
        </div>

        {/* Filters */}
        <div className="w-full">{children}</div>

        {/* Apply or reset filters */}
        {(isMediumTablet || isDesktop) && (
          <div className="w-full max-w-sm flex items-end justify-end gap-4 ms-auto">
            <Button
              key="reset"
              type="primary"
              size="middle"
              variant="outline"
              className="flex-1 !px-4"
              onClick={onResetFilters}
            >
              Reset
            </Button>
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              size="middle"
              variant="primary"
              className="flex-1 !px-4"
              form={formId}
            >
              Terapkan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHeader;
