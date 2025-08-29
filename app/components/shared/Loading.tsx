import React from "react";
import { Spin } from "antd";

const Loading = () => {
  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
    //   <div className="bg-white dark:bg-gray-900 px-6 py-5 rounded-xl shadow-lg flex flex-col items-center gap-3 animate-fade-in">
    //     <ClipLoader size={40} color="#3b82f6" />
    //     <p className="text-sm text-gray-600 dark:text-gray-300">
    //       Please wait...
    //     </p>
    //   </div>
    // </div>

    <div className="flex items-center justify-center h-[70dvh]">
      <Spin size="large" />
    </div>
  );
};

export default Loading;
