"use client";

import React, { useEffect, useState, Suspense } from "react";
import { auth } from "../functions/AuthProvider";
import { Section } from "../components/pages/Home/Section";
import { Role } from "../enums/Role";
import { roleSectionsMap } from "../constants/roleSectionsMap";

const HomePage: React.FC = () => {
  const [userRole, setUserRole] = useState<Role>(Role.GUEST);

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      setUserRole(user.role.name);
    } else {
      setUserRole(Role.GUEST);
    }
  }, []);

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
