"use client";

import Button from "@/app/components/shared/Button";
import { IMAGES } from "@/app/constants/images";
import { Role } from "@/app/enums/Role";
import { useAuth } from "@/app/hooks/useAuth";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SideBySideContentSection,
  SideBySideContentSectionProps,
} from "../Section";
import { TextVariant } from "@/app/types/ui/TextVariant";
import { getTextClassName } from "@/app/utils/ui/getTextClassName";
import { ROUTES } from "@/app/constants/routes";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useUserStats } from "@/app/hooks/users/useUserStats";

const StatsSection = () => {
  const router = useRouter();
  const { getCachedUserProfile } = useAuth();

  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<Role>(Role.STUDENT);

  useEffect(() => {
    const user = getCachedUserProfile();
    if (user) {
      setUserName(user.name);
      setUserRole(user.role.name);
    }
  }, [getCachedUserProfile]);

  const DataRow = ({
    icon,
    text,
    textVariant = "text-xl-semibold",
  }: {
    icon?: { src: string; alt: string };
    text: string;
    textVariant?: TextVariant;
  }) => {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        {icon && <Image src={icon.src} alt={icon.alt} width={28} height={28} />}
        <p className={getTextClassName(textVariant)}>{text}</p>
      </div>
    );
  };

  const LeftSideContent = () => {
    const { data: subjects = [] } = useSubjects();
    const { data: userStats } = useUserStats();

    if (!userStats) return;

    const { level, currXp, nextLvlMinXp, xpProgress } = userStats;

    const StudentData = () => {
      return (
        <>
          <DataRow text={`Level ${level}`} textVariant="text-4xl-bold" />
          <DataRow
            text={`XP: ${currXp} / ${nextLvlMinXp}`}
            textVariant="text-xl-semibold"
          />
          <div className="w-full bg-background rounded-2xl h-8 overflow-hidden mt-2">
            <div
              className="bg-primary h-8 rounded-2xl transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </>
      );
    };

    const TeacherData = () => {
      return (
        <>
          <DataRow text={userName} textVariant="text-4xl-bold" />
          <div className="flex flex-col gap-4">
            <DataRow
              icon={{ src: IMAGES.PEOPLE, alt: "active students" }}
              text={`Active Students: 142`}
              textVariant="text-xl-semibold"
            />
            <DataRow
              icon={{ src: IMAGES.TASK, alt: "active tasks" }}
              text={`Active Tasks: 6 ongoing tasks`}
              textVariant="text-xl-semibold"
            />
          </div>
        </>
      );
    };

    const AdminData = () => {
      return (
        <>
          <DataRow
            icon={{ src: IMAGES.PEOPLE, alt: "total registered users" }}
            text={`Total Registered Users: 3,120`}
            textVariant="text-xl-semibold"
          />
          <DataRow
            icon={{ src: IMAGES.SUBJECT, alt: "total subjects" }}
            text={`Total Subjects: ${subjects.length}`}
            textVariant="text-xl-semibold"
          />
          <DataRow
            icon={{ src: IMAGES.TASK, alt: "most popular task" }}
            text={`Most Popular Task: Math Tryout 2025`}
            textVariant="text-xl-semibold"
          />
        </>
      );
    };

    return (
      <div className="w-[100%] lg:w-[80%] flex flex-col sm:flex-row gap-12">
        <div className="w-40 h-40">
          <Image
            src={IMAGES.DEFAULT_PROFILE}
            alt={userName}
            width={250}
            height={250}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 justify-between">
          {userRole === Role.STUDENT ? (
            <StudentData />
          ) : userRole === Role.TEACHER ? (
            <TeacherData />
          ) : (
            <AdminData />
          )}
        </div>
      </div>
    );
  };

  const RightSideContent = () => {
    const handleClickCTA = () => {
      if (userRole === Role.STUDENT) {
        router.push("/profile");
      } else if (userRole === Role.TEACHER) {
        router.push(ROUTES.DASHBOARD.TEACHER.CLASS);
      } else {
        router.push(ROUTES.DASHBOARD.ADMIN.HOME);
      }
    };

    const StudentData = () => {
      return (
        <DataRow
          icon={{ src: IMAGES.BADGE, alt: "top student badge" }}
          text={`Quiz Master`}
          textVariant="text-xl-semibold"
        />
      );
    };

    const TeacherData = () => {
      return (
        <>
          <div className="flex flex-col gap-4">
            <DataRow
              icon={{ src: IMAGES.LEADERBOARD, alt: "top student" }}
              text={`Top Student of the Week`}
              textVariant="text-[1.8rem]-semibold"
            />
            <DataRow text={`Zahra L. - 3,200 pts`} textVariant="text-base-semibold" />
          </div>
        </>
      );
    };

    return (
      <div className="w-full lg:w-[20%] flex flex-col items-start lg:items-end justify-between self-stretch">
        {/* TOP SECTION */}
        <div className="flex-1 flex flex-col gap-2 font-semibold">
          {userRole === Role.STUDENT ? (
            <StudentData />
          ) : userRole === Role.TEACHER ? (
            <TeacherData />
          ) : (
            <></>
          )}
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-4 lg:mt-auto">
          <Button
            type="primary"
            size="large"
            variant="primary"
            className="!px-8 !rounded-3xl"
            onClick={handleClickCTA}
          >
            <span className="text-lg font-semibold">{`View ${
              userRole === Role.STUDENT
                ? "Profile"
                : userRole === Role.TEACHER
                ? "Class"
                : "Dashboard"
            }`}</span>
            <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </Button>
        </div>
      </div>
    );
  };

  const statsSectionContent: SideBySideContentSectionProps = {
    left: <LeftSideContent />,
    right: <RightSideContent />,
  };

  return <SideBySideContentSection {...statsSectionContent} />;
};

export default StatsSection;