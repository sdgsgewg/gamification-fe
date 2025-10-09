"use client";

import { Role } from "@/app/enums/Role";
import { auth } from "@/app/functions/AuthProvider";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const user = auth.getCachedUserProfile();
  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) setUserRole(user.role.name);
  }, []);

  if (!user) return;

  return (
    <div className="text-black">
      <p>Hello World</p>
      <h1>{`Name: ${user.name}`}</h1>
      <p>{`Role: ${userRole}`}</p>
    </div>
  );
};

export default ProfilePage;
