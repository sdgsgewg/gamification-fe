import React from "react";

export default function AttemptCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-6 lg:gap-y-10 gap-x-0 xxs:gap-x-4 sm:gap-x-6 md:gap-x-12`}
    >
      {children}
    </div>
  );
}
