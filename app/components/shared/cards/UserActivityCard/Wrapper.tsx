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
      className={`${
        isHalfWidth ? "lg:w-[50%] lg:max-w-[50%]" : "w-full"
      } h-full flex flex-col`}
    >
      <h2 className="text-tx-primary-accent text-2xl font-semibold mb-4">
        {title}
      </h2>

      <div className="bg-card border border-outline rounded-2xl py-2 px-5 shadow-sm overflow-y-auto max-h-[24rem]">
        {children}
      </div>
    </div>
  );
};

export default UserActivityCardWrapper;
