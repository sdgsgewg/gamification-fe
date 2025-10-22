"use client";

import React, { useState } from "react";
import Sidebar from "../components/layout/DashboardLayout/Sidebar";
import Header from "../components/layout/DashboardLayout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative w-full max-w-full bg-background flex min-h-screen overflow-hidden">
      {/* SIDEBAR */}
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-tertiary border-r-2 border-br-primary shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* DESKTOP: fixed sidebar */}
      <div className="hidden lg:block">
        {/* wrapper fixed supaya sidebar tetap diam */}
        <div className="fixed left-0 top-0 h-screen w-64">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      <div className="flex-1 lg:ml-64 min-h-screen w-[75dvw]">
        <Header onToggle={handleToggleSidebar} />
        <main className="flex-1 overflow-auto pt-6 pb-12 px-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
