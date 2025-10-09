import React from "react";
import Image from "next/image";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import Button from "@/app/components/shared/Button";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSectionContext } from "../../pages/Home/Section";
import { ROUTES } from "@/app/constants/routes";

type FromPage = "home" | "subjects";

interface SubjectCardProps {
  subject: SubjectOverviewResponse;
  fromPage: FromPage;
}

const SubjectCard = ({ subject, fromPage }: SubjectCardProps) => {
  const { image, name, activityCount } = subject;
  const router = useRouter();

  const { isOdd } = useSectionContext();

  const homePageBgColor = isOdd ? "bg-white" : "bg-[#F5F4FF]";
  const subjectPageBgColor = "bg-white";
  const bgColor = fromPage === "home" ? homePageBgColor : subjectPageBgColor;

  const navigateToActivityPage = () => {
    router.push(ROUTES.ROOT.SUBJECTS);
  };

  return (
    <div
      className={`${bgColor} max-w-[16rem] flex flex-col items-start justify-start rounded-xl shadow-sm p-6`}
    >
      <div className="w-full mb-2">
        <Image src={image ?? ""} alt={name} width={64} height={64} />
      </div>
      <h4 className="text-xl font-bold text-start mb-1">{name}</h4>
      <p className="text-black text-sm font-medium mb-6">{`${activityCount} Aktivitas Tersedia`}</p>
      <Button
        type="primary"
        size="middle"
        variant="primary"
        className="!px-4 !rounded-3xl !mt-auto"
        onClick={navigateToActivityPage}
      >
        <span className="text-base font-semibold">Jelajahi</span>
        <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
      </Button>
    </div>
  );
};

export default SubjectCard;
