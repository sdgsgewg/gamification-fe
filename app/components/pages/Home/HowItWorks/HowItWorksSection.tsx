import {
  CenteredContentSection,
  CenteredContentSectionProps,
} from "../Section";
import { HowItWorksCardWrapper } from "./HowItWorksCardWrapper";

const howItWorksSectionHeader: CenteredContentSectionProps = {
  title: "Cara Kerja",
  subtitle: (
    <>
      <p>
        Kami senantiasa mendukung dan menyukseskan proses pembelajaran Anda.
      </p>
      <p>Berikut cara kerjanya.</p>
    </>
  ),
  children: <HowItWorksCardWrapper />,
};

const HowItWorksSection: React.FC = () => {
  return <CenteredContentSection {...howItWorksSectionHeader} />;
};

export default HowItWorksSection;
