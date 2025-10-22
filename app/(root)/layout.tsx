import React from "react";
import Header from "../components/layout/MainLayout/Header";
import Footer from "../components/layout/MainLayout/Footer";

// bg-[#F5F4FF] dark:bg-red-900

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-background text-foreground min-h-screen pt-16 lg:pt-19">
        {children}
      </main>
      <Footer />
    </>
  );
}
