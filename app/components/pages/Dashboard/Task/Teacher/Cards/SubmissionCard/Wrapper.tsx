import React from "react";

export default function SubmissionCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>{children}</div>
  );
}
