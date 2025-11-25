"use client";

import Button from "@/app/components/shared/Button";
import { LeaderboardPreviewTable } from "@/app/components/shared/table/LeaderboardTable";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {
  SideBySideContentSection,
  SideBySideContentSectionProps,
} from "../Section";
import { ROUTES } from "@/app/constants/routes";
import { useStudentLeaderboard } from "@/app/hooks/leaderboards/useStudentLeaderboard";
import { LeaderboardScopeEnum } from "@/app/enums/LeaderboardSopeEnum";

const LeaderboardSection = () => {
  const router = useRouter();

  const { data: leaderboardData = [] } = useStudentLeaderboard({
    scope: LeaderboardScopeEnum.GLOBAL,
  });

  const navigateToLeaderboardPage = () => {
    router.push(ROUTES.ROOT.LEADERBOARD);
  };

  const LeaderboardTextContent = () => {
    return (
      <div className="w-full lg:w-1/2">
        <h3 className="text-3xl sm:text-4xl font-bold mb-4">
          Latest Leaderboard
        </h3>
        <p className="text-tx-secondary text-base font-medium mb-6 sm:mb-8">
          Make learning more exciting with the leaderboard system! Climb to the
          top by completing assignments and challenges — prove that you can be
          the best.
        </p>
        <Button
          type="primary"
          size="large"
          variant="primary"
          className="!px-8 !rounded-3xl"
          onClick={navigateToLeaderboardPage}
        >
          <span className="text-lg font-semibold">View Leaderboard</span>
          <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
        </Button>
      </div>
    );
  };

  const LeaderboardPreview = () => {
    return (
      <div className="w-full lg:w-1/2">
        <LeaderboardPreviewTable data={leaderboardData.slice(0, 5)} />
      </div>
    );
  };

  const leaderboardSectionContent: SideBySideContentSectionProps = {
    left: <LeaderboardTextContent />,
    right: <LeaderboardPreview />,
  };

  return <SideBySideContentSection {...leaderboardSectionContent} />;
};

export default LeaderboardSection;
