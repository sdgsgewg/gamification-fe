import React from "react";

interface StatusBarProps {
  current: number;
  total: number;
  labelClassName?: string;
  bgClassName?: string;
  height: string;
}

// Activity Card: h-3

const StatusBar = ({
  current,
  total,
  labelClassName = "text-[0.625rem] font-medium",
  bgClassName = "bg-background",
  height,
}: StatusBarProps) => {
  return (
    <div className="flex flex-col">
      {/* Status Text */}
      <p className={`${labelClassName}`}>{`${current} dari ${total} Soal`}</p>
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
