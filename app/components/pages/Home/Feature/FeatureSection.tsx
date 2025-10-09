import {
  CenteredContentSection,
  CenteredContentSectionProps,
} from "../Section";
import { FeatureCardWrapper } from "./FeatureCardWrapper";

const featureSectionHeader: CenteredContentSectionProps = {
  title: "Fitur Unggulan",
  subtitle:
    "Kami berkomitmen untuk mendukung proses pembelajaran Anda melalui berbagai fitur unggulan yang dirancang untuk membuat belajar menjadi lebih menarik, interaktif, dan terarah.",
  children: <FeatureCardWrapper />,
};

const FeatureSection: React.FC = () => {
  return <CenteredContentSection {...featureSectionHeader} />;
};

export default FeatureSection;
