"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import QueryProvider from "./providers/QueryProvider";
import { AuthProvider } from "./functions/AuthProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        value={{ light: "light", dark: "dark" }}
      >
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
