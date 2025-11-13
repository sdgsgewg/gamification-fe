"use client";

import React from "react";
import Image from "next/image";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import Button from "@/app/components/shared/Button";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "@/app/constants/routes";
import { useSafeSectionContext } from "@/app/hooks/useSafeSectionContext";
import { IMAGES } from "@/app/constants/images";

type FromPage = "home" | "subjects";

interface SubjectCardProps {
  subject: SubjectOverviewResponse;
  fromPage: FromPage;
}

const SubjectCard = ({ subject, fromPage }: SubjectCardProps) => {
  const { subjectId, image, name, activityCount } = subject;
  const router = useRouter();

  const { isOdd } = useSafeSectionContext();

  const homePageBgColor = isOdd ? "bg-card" : "bg-background";
  const subjectPageBgColor = "bg-card";
  const bgColor = fromPage === "home" ? homePageBgColor : subjectPageBgColor;

  const navigateToActivityPage = () => {
    router.push(
      `${ROUTES.ROOT.ACTIVITY}?subjectId=${encodeURIComponent(subjectId)}`
    );
  };

  return (
    <div
      className={`${bgColor} ${
        fromPage === "home" ? "max-w-[16rem]" : "max-w-[13rem]"
      } flex flex-col items-start justify-start rounded-xl shadow-sm p-6`}
    >
      <div className="w-full mb-2">
        <Image
          src={image ?? IMAGES.DEFAULT_IMAGE}
          alt={name}
          width={64}
          height={64}
        />
      </div>
      <h4 className="text-xl font-bold text-start mb-1">{name}</h4>
      <p className="text-dark text-sm font-medium mb-6">{`${activityCount} Available Activities`}</p>
      <Button
        type="primary"
        size="middle"
        variant="primary"
        className="!px-4 !rounded-3xl !mt-auto"
        onClick={navigateToActivityPage}
      >
        <span className="text-base font-semibold">Explore</span>
        <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
      </Button>
    </div>
  );
};

export default SubjectCard;
