import {
  CenteredContentSection,
  CenteredContentSectionProps,
} from "../Section";
import { FeatureCardWrapper } from "./FeatureCardWrapper";

const featureSectionHeader: CenteredContentSectionProps = {
  title: "Key Features",
  subtitle:
    "We are committed to supporting your learning journey through a variety of key features designed to make studying more engaging, interactive, and well-structured.",
  children: <FeatureCardWrapper />,
};

const FeatureSection: React.FC = () => {
  return <CenteredContentSection {...featureSectionHeader} />;
};

export default FeatureSection;