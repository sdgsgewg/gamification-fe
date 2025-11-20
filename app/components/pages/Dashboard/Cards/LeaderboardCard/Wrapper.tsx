import React from "react";

export default function LeaderboardCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`space-y-3`}>{children}</div>;
}
