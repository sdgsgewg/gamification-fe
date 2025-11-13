import React from "react";

export default function TaskCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6`}>{children}</div>
  );
}
