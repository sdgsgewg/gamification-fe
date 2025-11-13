import {
  CenteredContentSection,
  CenteredContentSectionProps,
} from "../Section";
import { HowItWorksCardWrapper } from "./HowItWorksCardWrapper";

const howItWorksSectionHeader: CenteredContentSectionProps = {
  title: "How It Works",
  subtitle: (
    <>
      <p>
        We are always here to support and help you succeed in your learning journey.
      </p>
      <p>Here’s how it works.</p>
    </>
  ),
  children: <HowItWorksCardWrapper />,
};

const HowItWorksSection: React.FC = () => {
  return <CenteredContentSection {...howItWorksSectionHeader} />;
};

export default HowItWorksSection;