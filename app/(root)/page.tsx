"use client";

import React, { Suspense } from "react";
import { auth } from "../functions/AuthProvider";
import { Section } from "../components/pages/Home/Section";
import { Role } from "../enums/Role";
import { roleSectionsMap } from "../constants/roleSectionsMap";

const HomePage: React.FC = () => {
  const user = auth.getCachedUserProfile();
  const userRole = user?.role.name ?? Role.GUEST;

  return (
    <div className="font-sans text-gray-800">
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        {roleSectionsMap[userRole].map(({ name, element }, index) => (
          <Section key={name} sectionName={name} isOdd={index % 2 === 0}>
            {element}
          </Section>
        ))}
      </Suspense>
    </div>
  );
};

export default HomePage;
