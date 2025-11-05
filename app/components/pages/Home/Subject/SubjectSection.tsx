import { useRouter } from "next/navigation";
import {
  CenteredContentSection,
  CenteredContentSectionProps,
} from "../Section";
import SubjectCardWrapper from "./SubjectCardWrapper";
import { ROUTES } from "@/app/constants/routes";

export const SubjectSection: React.FC = () => {
  const router = useRouter();

  const handleClickCTA = () => {
    router.push(ROUTES.ROOT.SUBJECTS);
  };

  const subjectSectionHeader: CenteredContentSectionProps = {
    title: "Subjects",
    subtitle:
      "Discover a variety of popular subjects available on our platform. Each module is designed to help students understand lessons more easily through practice questions, quizzes, and fun educational games.",
    children: <SubjectCardWrapper />,
    cta: "View All Subjects",
    onClickCTA: handleClickCTA,
  };

  return <CenteredContentSection {...subjectSectionHeader} />;
};

export default SubjectSection;