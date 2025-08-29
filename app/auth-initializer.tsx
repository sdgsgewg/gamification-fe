"use client";
import { useEffect } from "react";
import { auth } from "./functions/AuthProvider";

const AuthInitializer = () => {
  useEffect(() => {
    const initialize = async () => {
      await auth.init();
    };
    initialize();
  }, []);

  return null;
};

export default AuthInitializer;
