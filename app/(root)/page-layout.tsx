import React from "react";

interface PageLayoutProps {
  children?: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="w-full pt-8 pb-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {children}
    </div>
  );
}
