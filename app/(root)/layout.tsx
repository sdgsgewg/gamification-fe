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
      <main className="bg-[#F5F4FF] min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
