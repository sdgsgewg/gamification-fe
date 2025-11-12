import React from "react";

interface UserActivityCardWrapperProps {
  title: string;
  isHalfWidth?: boolean;
  children: React.ReactNode;
}

const UserActivityCardWrapper = ({
  title,
  isHalfWidth = false,
  children,
}: UserActivityCardWrapperProps) => {
  return (
    <div
      className={`bg-card p-6 rounded-xl border border-light-muted shadow-sm  ${
        isHalfWidth ? "lg:w-[50%] lg:max-w-[50%]" : "w-full"
      } h-full flex flex-col`}
    >
      <h2 className="text-tx-primary-accent text-lg font-semibold mb-4">
        {title}
      </h2>

      <div className="py-2 overflow-y-auto max-h-[24rem]">{children}</div>
    </div>
  );
};

export default UserActivityCardWrapper;
