import React from "react";
import { useSectionContext } from "./Section";

export default function CardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sectionName } = useSectionContext();

  const threeGridSections = ["features"];
  const fourGridSections = ["howItWorks", "subject", "badge"];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        fourGridSections.includes(sectionName)
          ? "lg:grid-cols-4"
          : "lg:grid-cols-3"
      } gap-y-8 ${
        sectionName === "howItWorks"
          ? "lg:gap-y-0 lg:gap-x-8 xl:gap-x-12"
          : "lg:gap-y-12 lg:gap-x-16 xl:gap-x-20"
      } gap-x-0 sm:gap-x-8 md:gap-x-12`}
    >
      {children}
    </div>
  );
}
