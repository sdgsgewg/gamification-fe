import React from "react";

interface StatusBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  labelClassName?: string;
  bgClassName?: string;
  height: string;
}

const StatusBar = ({
  current,
  total,
  showLabel = true,
  labelClassName = "text-[0.625rem] font-medium",
  bgClassName = "bg-tertiary",
  height,
}: StatusBarProps) => {
  return (
    <div className="flex flex-col">
      {/* Status Text */}
      {showLabel && (
        <p
          className={`${labelClassName}`}
        >{`${current} out of ${total} questions`}</p>
      )}
      {/* Status Bar */}
      <div
        className={`w-full ${bgClassName} rounded-2xl shadow-xs ${height} overflow-hidden`}
      >
        <div
          className={`bg-primary ${height} rounded-2xl transition-all duration-500`}
          style={{ width: `${(current / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatusBar;
