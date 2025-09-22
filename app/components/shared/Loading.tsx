import React from "react";
import { Spin } from "antd";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm min-h-screen">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-8 py-7 rounded-2xl shadow-xl shadow-black/10 flex flex-col items-center gap-4 animate-fade-in">
        <Spin size="large" />
        {/* Text */}
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide animate-pulse">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
