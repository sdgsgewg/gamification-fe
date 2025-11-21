import React from "react";

interface DashboardSectionWrapperProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  isHalfWidth?: boolean;
  children: React.ReactNode;
}

const DashboardSectionWrapper = ({
  title,
  icon: Icon,
  isHalfWidth = false,
  children,
}: DashboardSectionWrapperProps) => {
  return (
    <div
      className={`bg-card p-6 rounded-xl border border-outline shadow-sm  ${
        isHalfWidth ? "lg:w-[50%] lg:max-w-[50%]" : "w-full"
      } h-full flex flex-col`}
    >
      <h2 className="flex items-center gap-2 text-tx-primary-accent text-lg font-semibold mb-4">
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </h2>

      {/* Content section */}
      {children}
    </div>
  );
};

export default DashboardSectionWrapper;
