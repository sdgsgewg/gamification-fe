import React from "react";
import Header from "../components/layout/AuthLayout/Header";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="bg-[#556FD7] dark:bg-[#556FD7] min-h-screen flex items-center justify-center pt-35 pb-20 transition-colors duration-300">
        <Toaster position="top-right" />
        {children}
      </main>
    </>
  );
}
