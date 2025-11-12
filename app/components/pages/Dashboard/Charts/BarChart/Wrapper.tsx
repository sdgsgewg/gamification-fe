import React from "react";

interface BarChartWrapperProps {
  title: string;
  children?: React.ReactNode;
}

const BarChartWrapper = ({ title, children }: BarChartWrapperProps) => {
  return (
    <div className="bg-card rounded-xl border border-light-muted shadow-sm p-6">
      <h2 className="text-tx-primary-accent text-lg font-semibold mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default BarChartWrapper;
