"use client";

import React, { createContext, useContext } from "react";
import { LinkOutlined } from "@ant-design/icons";

interface SectionContextValue {
  sectionName: string;
  isOdd: boolean;
}

const SectionContext = createContext<SectionContextValue | undefined>(
  undefined
);

export const useSectionContext = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSectionContext must be used within a Section");
  }
  return context;
};

interface ISectionProps {
  children: React.ReactNode;
}

export interface CenteredContentSectionProps extends ISectionProps {
  title: string;
  subtitle: string | React.ReactNode;
  cta?: string;
  onClickCTA?: () => void;
}

export interface SideBySideContentSectionProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

interface SectionProps extends ISectionProps {
  sectionName: string;
  isOdd: boolean;
}

export const CenteredContentSection: React.FC<CenteredContentSectionProps> = ({
  title,
  subtitle,
  cta,
  onClickCTA,
  children,
}) => {
  return (
    <section className="container flex flex-col items-center justify-center text-center mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 max-w-xl">
        {title}
      </h2>
      <span className="text-base text-foreground mb-8 sm:mb-16 max-w-xl">
        {subtitle}
      </span>
      {children}
      {cta && (
        <div
          className="flex flex-row gap-1 text-tx-primary-accent text-base font-semibold mt-8 sm:mt-16 cursor-pointer hover:underline"
          onClick={onClickCTA}
        >
          <LinkOutlined />
          <p>{cta}</p>
        </div>
      )}
    </section>
  );
};

export const SideBySideContentSection: React.FC<
  SideBySideContentSectionProps
> = ({ left, right }) => {
  const { sectionName } = useSectionContext();

  const customClassName =
    sectionName === "hero"
      ? "flex-col-reverse gap-4 items-center"
      : sectionName === "leaderboard"
      ? "flex-col gap-12 items-center"
      : sectionName === "stats"
      ? "flex-col gap-8 md:gap-12 items-stretch"
      : "";

  return (
    <section
      className={`container w-full mx-auto flex ${customClassName} lg:flex-row justify-between lg:gap-20`}
    >
      {left}
      {right}
    </section>
  );
};

export const Section: React.FC<SectionProps> = ({
  sectionName,
  isOdd,
  children,
}) => {
  return (
    <SectionContext.Provider value={{ sectionName, isOdd }}>
      <section
        className={`py-12 sm:py-16 px-4 [@media(min-width:400px)]:px-8 ${
          sectionName === "hero"
            ? "md:px-16 lg:px-24 xl:px-28"
            : "md:px-12 xl:px-16"
        } ${isOdd ? "bg-background" : "bg-surface"}`}
      >
        {children}
      </section>
    </SectionContext.Provider>
  );
};
