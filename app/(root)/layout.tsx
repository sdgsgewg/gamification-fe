import React from "react";
import Header from "../components/layout/MainLayout/Header";
import Footer from "../components/layout/MainLayout/Footer";

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
