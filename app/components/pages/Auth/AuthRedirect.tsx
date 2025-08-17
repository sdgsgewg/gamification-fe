"use client";

import React from "react";

interface AuthRedirectProps {
  message: string;
  linkText: string;
  onClick: () => void;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({
  message,
  linkText,
  onClick,
}) => {
  return (
    <div className="bg-[#F0F0F0] text-center flex items-center gap-1 px-8 py-5 rounded-b-lg">
      <span className="text-sm font-medium">{message}</span>
      <span
        onClick={onClick}
        className="text-[#4F68F8] text-sm font-medium cursor-pointer hover:underline"
      >
        {linkText}
      </span>
    </div>
  );
};

export default AuthRedirect;
