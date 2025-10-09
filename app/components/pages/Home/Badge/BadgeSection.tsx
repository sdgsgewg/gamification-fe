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
    title: "Koleksi Badge",
    subtitle:
      "Kumpulkan berbagai badge atas pencapaian belajar kamu dan tunjukkan sejauh mana progresmu.",
    children: <BadgeCardWrapper />,
    cta: "Lihat Semua Badge",
    onClickCTA: handleClickCTA,
  };

  return <CenteredContentSection {...badgeSectionHeader} />;
};

export default BadgeSection;
