"use client";

import Button from "@/app/components/shared/Button";
import { IMAGES } from "@/app/constants/images";
import { Role } from "@/app/enums/Role";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SideBySideContentSection,
  SideBySideContentSectionProps,
} from "../Section";
import { ROUTES } from "@/app/constants/routes";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useUserStats } from "@/app/hooks/users/useUserStats";
import { useTasks } from "@/app/hooks/tasks/useTasks";
import { TaskStatus } from "@/app/enums/TaskStatus";
import { useTeacherTotalStudents } from "@/app/hooks/class-students/useTeacherTotalStudents";
import { useUserRoleCounts } from "@/app/hooks/users/useUserRoleCounts";
import { useMostPopularTask } from "@/app/hooks/task-attempts/useMostPopularTask";
import StatusBar from "@/app/components/shared/StatusBar";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";

const StatsSection = () => {
  const router = useRouter();
  const { user, role } = useGetCachedUser();

  const [userName, setUserName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userRole, setUserRole] = useState<Role>(Role.STUDENT);

  useEffect(() => {
    if (user && role) {
      setUserName(user.name);
      setUsername(user.username);
      setUserRole(role);
    }
  }, [user, role]);

  const DataRow = ({
    icon,
    text,
    textClassName = "text-xl font-semibold",
  }: {
    icon?: { src: string; alt: string };
    text: string;
    textClassName?: string;
  }) => {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        {icon && <Image src={icon.src} alt={icon.alt} width={28} height={28} />}
        <p className={textClassName}>{text}</p>
      </div>
    );
  };

  const LeftSideContent = () => {
    const StudentView = () => {
      const { data: userStats } = useUserStats();

      if (!userStats) return;

      const { level, currXp, nextLvlMinXp } = userStats;

      return (
        <>
          <DataRow
            text={`Level ${level}`}
            textClassName="text-2xl sm:text-3xl font-bold"
          />
          <DataRow
            text={`XP: ${currXp} / ${nextLvlMinXp}`}
            textClassName="text-lg sm:text-xl font-semibold"
          />
          <div className="mt-2">
            <StatusBar
              current={currXp}
              total={nextLvlMinXp}
              showLabel={false}
              height="h-6 sm:h-8"
            />
          </div>
        </>
      );
    };

    const TeacherView = () => {
      const { data: activeTasks } = useTasks({ status: TaskStatus.PUBLISHED });
      const { data: totalStudents } = useTeacherTotalStudents();

      return (
        <>
          <DataRow
            text={userName}
            textClassName="text-3xl sm:text-4xl font-bold"
          />
          <div className="flex flex-col gap-4">
            <DataRow
              icon={{ src: IMAGES.PEOPLE, alt: "active students" }}
              text={`Active Students: ${totalStudents?.length}`}
              textClassName="text-xl font-semibold"
            />
            <DataRow
              icon={{ src: IMAGES.TASK, alt: "active tasks" }}
              text={`Active Tasks: ${activeTasks} ongoing tasks`}
              textClassName="text-xl font-semibold"
            />
          </div>
        </>
      );
    };

    const AdminView = () => {
      const { data: subjects = [] } = useSubjects();
      const { data: userRoleCounts } = useUserRoleCounts();
      const { data: mostPopularTasks = [] } = useMostPopularTask();

      return (
        <>
          <DataRow
            icon={{ src: IMAGES.PEOPLE, alt: "total registered users" }}
            text={`Total Registered Users: ${userRoleCounts?.totalUsers}`}
            textClassName="text-xl font-semibold"
          />
          <DataRow
            icon={{ src: IMAGES.SUBJECT, alt: "total subjects" }}
            text={`Total Subjects: ${subjects.length}`}
            textClassName="text-xl font-semibold"
          />
          {mostPopularTasks && mostPopularTasks.length > 0 && (
            <DataRow
              icon={{ src: IMAGES.TASK, alt: "most popular task" }}
              text={`Most Popular Task: ${mostPopularTasks[0].title} (${mostPopularTasks[0].attemptCount} attempts)`}
              textClassName="text-xl font-semibold"
            />
          )}
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
            <StudentView />
          ) : userRole === Role.TEACHER ? (
            <TeacherView />
          ) : (
            <AdminView />
          )}
        </div>
      </div>
    );
  };

  const RightSideContent = () => {
    const handleClickCTA = () => {
      if (userRole === Role.STUDENT) {
        router.push(`${ROUTES.ROOT.PROFILE}/${username}`);
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
          textClassName="text-xl font-semibold"
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
              textClassName="text-[1.8rem] font-bold"
            />
            <DataRow
              text={`Zahra L. - 3,200 pts`}
              textClassName="text-base font-semibold"
            />
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
