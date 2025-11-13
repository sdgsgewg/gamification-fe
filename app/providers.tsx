"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import QueryProvider from "./providers/QueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{ light: "light", dark: "dark" }}
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
