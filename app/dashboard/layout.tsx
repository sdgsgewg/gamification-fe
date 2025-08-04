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
    <div className="bg-[#F5F4FF] flex min-h-screen">
      <div className={`${isSidebarOpen ? "block" : "hidden"} lg:block`}>
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Header onToggle={handleToggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
