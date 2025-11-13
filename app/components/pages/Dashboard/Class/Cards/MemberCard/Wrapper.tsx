import React from "react";

export default function MemberCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-0 gap-x-0`}
    >
      {children}
    </div>
  );
}
