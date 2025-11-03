"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSectionContext } from "../Section";
import { BadgeData } from "./BadgeCardWrapper";
import { CheckSquareOutlined } from "@ant-design/icons";
import { Role } from "@/app/enums/Role";
import { useAuth } from "@/app/hooks/useAuth";

interface BadgeCardProps {
  badge: BadgeData;
}

const BadgeCard = ({ badge }: BadgeCardProps) => {
  const { getCachedUserProfile } = useAuth();

  const { icon, name, description, progressPercentage, progressText, notes } =
    badge;
  const { isOdd } = useSectionContext();
  const bgColor = isOdd ? "bg-card" : "bg-background";

  const [isFlipped, setIsFlipped] = useState(false);

  const [userRole, setUserRole] = useState<Role>(Role.GUEST);

  useEffect(() => {
    const user = getCachedUserProfile();
    if (user) {
      setUserRole(user.role.name);
    } else {
      setUserRole(Role.GUEST);
    }
  }, [getCachedUserProfile]);

  const ProgressText = () => {
    return (
      <span
        className={`flex gap-2 ${
          progressPercentage === 100 ? "text-success" : "text-primary"
        } ${isFlipped ? "text-sm" : "text-base"} font-semibold`}
      >
        {progressPercentage === 100 ? <CheckSquareOutlined /> : ""}
        <p>{progressText}</p>
      </span>
    );
  };

  return (
    <div
      className="relative w-52 h-52 [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div
          className={`${bgColor} absolute inset-0 rounded-xl shadow-sm p-4 flex flex-col items-center justify-center gap-2 [backface-visibility:hidden]`}
        >
          <div className="w-full flex items-center justify-center">
            <Image src={icon.src} alt={icon.alt} width={100} height={100} />
          </div>
          <h4 className="text-xl font-bold">{name}</h4>
          {userRole === Role.STUDENT && <ProgressText />}
        </div>

        {/* BACK SIDE */}
        <div
          className={`${bgColor} absolute inset-0 rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]`}
        >
          <div className="flex flex-col">
            <h4 className="text-xl font-bold">{name}</h4>
            <p className="text-sm text-tx-secondary">{description}</p>
          </div>
          {userRole === Role.STUDENT && (
            <div className="flex flex-col items-center justify-center gap-1 mt-auto">
              <ProgressText />
              <p className="text-xs text-tx-tertiary font-normal">{notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;
