import React from "react";

export default function ClassCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 lg:gap-y-12 gap-x-0 sm:gap-x-8 md:gap-x-12`}
    >
      {children}
    </div>
  );
}
