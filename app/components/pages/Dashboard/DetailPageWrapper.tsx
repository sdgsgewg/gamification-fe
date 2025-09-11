"use client";

import React from "react";

interface DetailPageWrapperProps {
  left: React.ReactNode;
  right: React.ReactNode;
  bottom?: React.ReactNode;
}

export default function DetailPageWrapper({
  left,
  right,
  bottom,
}: DetailPageWrapperProps) {
  return (
    <div className="w-full space-y-0 md:space-y-8">
      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 xl:gap-20">
        <div className="md:w-2/5 space-y-8">{left}</div>
        <div className="md:w-3/5 space-y-8">{right}</div>
      </div>
      {bottom && <div>{bottom}</div>}
    </div>
  );
}
