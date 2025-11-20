import React from "react";

export default function PendingTaskCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`space-y-3`}>{children}</div>;
}
