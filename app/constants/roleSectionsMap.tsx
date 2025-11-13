import { Role } from "../enums/Role";
import HeroSection from "../components/pages/Home/Hero/HeroSection";
import HowItWorksSection from "../components/pages/Home/HowItWorks/HowItWorksSection";
import FeatureSection from "../components/pages/Home/Feature/FeatureSection";
import StatsSection from "../components/pages/Home/Stats/StatsSection";
import LeaderboardSection from "../components/pages/Home/Leaderboard/LeaderboardSection";
import SubjectSection from "../components/pages/Home/Subject/SubjectSection";
import CTASection from "../components/pages/Home/CTA/CTASection";
import BadgeSection from "../components/pages/Home/Badge/BadgeSection";

// ===============================
// Role-based Home Section Mapping
// ===============================

export const roleSectionsMap = {
  [Role.GUEST]: [
    { name: "hero", element: <HeroSection /> },
    { name: "howItWorks", element: <HowItWorksSection /> },
    { name: "features", element: <FeatureSection /> },
    { name: "leaderboard", element: <LeaderboardSection /> },
    { name: "subject", element: <SubjectSection /> },
    { name: "badge", element: <BadgeSection /> },
    { name: "cta", element: <CTASection /> },
  ],
  [Role.STUDENT]: [
    { name: "hero", element: <HeroSection /> },
    { name: "howItWorks", element: <HowItWorksSection /> },
    { name: "features", element: <FeatureSection /> },
    { name: "stats", element: <StatsSection /> },
    { name: "leaderboard", element: <LeaderboardSection /> },
    { name: "subject", element: <SubjectSection /> },
    { name: "badge", element: <BadgeSection /> },
    { name: "cta", element: <CTASection /> },
  ],
  [Role.TEACHER]: [
    { name: "hero", element: <HeroSection /> },
    { name: "howItWorks", element: <HowItWorksSection /> },
    { name: "features", element: <FeatureSection /> },
    { name: "stats", element: <StatsSection /> },
  ],
  [Role.ADMIN]: [
    { name: "hero", element: <HeroSection /> },
    { name: "stats", element: <StatsSection /> },
  ],
};
