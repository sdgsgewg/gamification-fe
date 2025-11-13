import { useRouter } from "next/navigation";
import {
  CenteredContentSection,
  CenteredContentSectionProps,
} from "../Section";
import BadgeCardWrapper from "./BadgeCardWrapper";
import { ROUTES } from "@/app/constants/routes";

export const BadgeSection: React.FC = () => {
  const router = useRouter();

  const handleClickCTA = () => {
    router.push(ROUTES.ROOT.BADGES);
  };

  const badgeSectionHeader: CenteredContentSectionProps = {
    title: "Badge Collection",
    subtitle:
      "Collect various badges for your learning achievements and showcase your progress.",
    children: <BadgeCardWrapper />,
    cta: "View All Badges",
    onClickCTA: handleClickCTA,
  };

  return <CenteredContentSection {...badgeSectionHeader} />;
};

export default BadgeSection;