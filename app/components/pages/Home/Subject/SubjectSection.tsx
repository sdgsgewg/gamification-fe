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
    title: "Mata Pelajaran",
    subtitle:
      "Temukan berbagai mata pelajaran populer yang tersedia di platform kami. Setiap modul dirancang untuk membantu siswa memahami materi dengan lebih mudah melalui latihan soal, kuis, dan game edukatif yang menyenangkan.",
    children: <SubjectCardWrapper />,
    cta: "Lihat Semua Mata Pelajaran",
    onClickCTA: handleClickCTA,
  };

  return <CenteredContentSection {...subjectSectionHeader} />;
};

export default SubjectSection;
