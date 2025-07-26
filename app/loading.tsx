import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 px-8 py-6 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center animate-fade-in">
        <div className="mb-4">
          <ClipLoader size={48} color="#3b82f6" />
        </div>
        <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
