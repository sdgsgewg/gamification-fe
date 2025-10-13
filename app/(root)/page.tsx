"use client";

import React, { Suspense } from "react";
import { Section } from "../components/pages/Home/Section";
import { roleSectionsMap } from "../constants/roleSectionsMap";
import { useGetCachedUser } from "../hooks/useGetCachedUser";

const HomePage: React.FC = () => {
  const { role } = useGetCachedUser();

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      {roleSectionsMap[role].map(({ name, element }, index) => (
        <Section key={name} sectionName={name} isOdd={index % 2 === 0}>
          {element}
        </Section>
      ))}
    </Suspense>
  );
};

export default HomePage;
