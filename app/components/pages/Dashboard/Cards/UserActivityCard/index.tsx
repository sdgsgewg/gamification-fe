import React from "react";

interface UserActivityCardProps {
  description: string;
  createdAt: string;
}

const UserActivityCard = ({
  description,
  createdAt,
}: UserActivityCardProps) => {
  return (
    <div className="w-full flex justify-between items-start py-3 border-b border-outline last:border-none">
      <div className="max-w-[90%] relative flex-1 pr-4">
        {/* <div className="relative flex-1 pl-6 pr-4"> */}
        {/* <div className="absolute left-0 top-4 w-2 h-2 bg-primary rounded-full"></div> */}
        <span
          className="text-tx-primary text-sm leading-relaxed break-words"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={description} // Tooltip kalau mau lihat full text
        >
          {description}
        </span>
      </div>
      <span className="text-xs text-tx-tertiary whitespace-nowrap">
        {createdAt}
      </span>
    </div>
  );
};

export default UserActivityCard;
