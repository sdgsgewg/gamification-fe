import React from "react";

export default function TaskCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-y-8 lg:gap-y-12 gap-x-0 sm:gap-x-8 md:gap-x-12 me-20`}
    >
      {children}
    </div>
  );
}
